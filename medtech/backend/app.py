from flask import Flask, request, jsonify, make_response
import os
import cv2
import numpy as np
import pandas as pd

from skimage import feature
from sklearn.cluster import KMeans
from flask_cors import CORS
import joblib
import base64

# CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
# Allow requests from any origin
# CORS(app, resources={r"/execute-python-code": {"origins": "*"}})

app = Flask(__name__)
# CORS(app) 
CORS(app, resources={r"*": {"origins": "http://localhost:5173"}})
def remove_hair(image):
    try:
        # Convert image to grayscale
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Perform histogram equalization
        equalized_image = cv2.equalizeHist(gray_image)

        # Define kernel for morphology operations
        kernel = np.ones((6, 3), np.uint8)

        # Perform blackhat filtering
        blackhat = cv2.morphologyEx(equalized_image, cv2.MORPH_BLACKHAT, kernel)

        # Threshold the blackhat image
        ret, thresh = cv2.threshold(blackhat, 8, 255, cv2.THRESH_BINARY)

        # InPaint the original image based on the Threshold mask
        dst_gray = cv2.inpaint(image, thresh, 1, cv2.INPAINT_NS)  # Use INPAINT_NS for potentially faster processing

        return dst_gray
    except Exception as e:
        print(f"Error in removing hair: {str(e)}")
        return None


def vignette(image):
    try:
        # Convert the image to grayscale for analysis
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Compute a simple circular vignette mask based on the image size
        height, width = image.shape[:2]
        center_x, center_y = width // 2, height // 2
        kernel_x = cv2.getGaussianKernel(width, 150)
        kernel_y = cv2.getGaussianKernel(height, 150)
        kernel = kernel_y * kernel_x.T
        mask = 255 * kernel / np.linalg.norm(kernel)
        # mask = np.zeros_like(gray, dtype=np.float32)
        corrected_img = np.zeros_like(image, dtype=np.float32)
        np.seterr(divide='ignore', invalid='ignore')
        np.seterr(divide='warn', invalid='warn') 
        for y in range(height):
            for x in range(width):
                distance = np.sqrt((x - center_x) ** 2 + (y - center_y) ** 2)
                mask[y, x] = min(1, distance / (width // 2))

        # Apply the vignette removal by lightening the corners and edges
        corrected_img = np.zeros_like(image, dtype=np.float32)
        for i in range(3):
            # Avoid division by zero by handling the case when mask is 1
            mask_inverse = np.where(mask == 1, 0, 1 - mask)
            corrected_img[:, :, i] = image[:, :, i] / mask_inverse

        # Set the edges to white
        corrected_img[mask == 0] = 255

        return np.clip(corrected_img, 0, 255).astype(np.uint8)

    except Exception as e:
        print(f"Error in removing vignette: {str(e)}")
        return None


def resize_image(image, target_height=150, target_width=200):
    try:
        if image is not None:
            resized_image = cv2.resize(image, (target_width, target_height))
            return resized_image
        else:
            return None
    except Exception as e:
        return None


def rgb_value(image):
    if image is not None:
        # Convert BGR to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Mask to identify non-white pixels
        non_white_mask = np.any(image_rgb < 255, axis=2)

        # Extract non-white pixels
        non_white_pixels = image_rgb[non_white_mask]

        # Sum the RGB values across all non-white pixels in the image
        total_red = np.sum(non_white_pixels[:, 0])  # Red channel
        total_green = np.sum(non_white_pixels[:, 1])  # Green channel
        total_blue = np.sum(non_white_pixels[:, 2])  # Blue channel

        # Return the total RGB values as a tuple
        return total_red, total_green, total_blue
    else:
        return None


def masking(corrected_img):
    # Convert the preprocessed image to grayscale
    gray = cv2.cvtColor(corrected_img, cv2.COLOR_BGR2GRAY)
    margin = 25

    # Define the central region of interest
    height, width = gray.shape
    center_h, center_w = height // 2, width // 2
    roi_size = min(height, width)
    roi_size += margin * 5  # Expand by margin on each side
    roi_size = min(roi_size, min(height, width))  # Ensure ROI size does not exceed image boundaries

    # Define the new ROI boundaries
    roi = gray[center_h - roi_size // 2: center_h + roi_size // 2,
          center_w - roi_size // 2: center_w + roi_size // 2]

    # Reshape the ROI into a 1D array of pixels
    pixels = np.reshape(roi, (-1, 1))

    # Apply k-means clustering
    kmeans = KMeans(n_clusters=2)
    kmeans.fit(pixels)

    # Get labels for all pixels in the ROI
    labels = kmeans.labels_

    # Reshape labels back into the ROI shape
    labels = labels.reshape(roi.shape)

    # Choose the label that corresponds to the lesion
    # This can be based on the assumption that the lesion is usually darker than the surrounding skin
    lesion_label = np.argmin(kmeans.cluster_centers_)

    # Create binary mask where the lesion is labeled as 1 and background as 0
    binary_mask_roi = np.uint8(labels == lesion_label)

    # Create a binary mask for the entire image
    binary_mask = np.zeros_like(gray, dtype=np.uint8)
    binary_mask[center_h - roi_size // 2: center_h + roi_size // 2,
    center_w - roi_size // 2: center_w + roi_size // 2] = binary_mask_roi

    return binary_mask


def calculate_glcm_properties(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    grayCom = feature.graycomatrix(gray, [1], [0, np.pi / 4, np.pi / 2, 3 * np.pi / 4], levels=256)
    Contrast = np.mean(feature.graycoprops(grayCom, 'contrast'))
    Dissimilarity = np.mean(feature.graycoprops(grayCom, 'dissimilarity'))
    Homogeneity = np.mean(feature.graycoprops(grayCom, 'homogeneity'))
    Energy = np.mean(feature.graycoprops(grayCom, 'energy'))
    Correlation = np.mean(feature.graycoprops(grayCom, 'correlation'))
    ASM = np.mean(feature.graycoprops(grayCom, 'ASM'))
    return Contrast, Dissimilarity, Homogeneity, Energy, Correlation, ASM


@app.route('/app', methods=['POST'])
def process_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400

        image_file = request.files['image']
        image_data = image_file.read()
        image_np = np.frombuffer(image_data, dtype=np.uint8)
        image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
        image = resize_image(image, target_width=200)
        hair_removed_img = remove_hair(image)
        blurred_image = cv2.GaussianBlur(hair_removed_img, (1, 1), 0)

        vignette_corrected_img = vignette(blurred_image)

        binary_mask = masking(vignette_corrected_img)

        rgb_values = rgb_value(vignette_corrected_img)
        lesion_size = np.sum(binary_mask)
        contrast, dissimilarity, homogeneity, energy, correlation, asm = calculate_glcm_properties(vignette_corrected_img)

        red_value, green_value, blue_value = rgb_value(vignette_corrected_img)

        data = pd.DataFrame({
            'age': 71,
            'sex': 1,
            'localization': 10,
            'Contrast': [contrast],
            'Energy': [energy],
            'Dissimilarity': [dissimilarity],
            'ASM': [asm],
            'Homogeneity': [homogeneity],
            'Correlation': [correlation],
            'lesion_size': [lesion_size],
            'red_value': [red_value],
            'green_value': [green_value],
            'blue_value': [blue_value],
        })
        model = joblib.load('../../knn_classifier.pkl')
        predicted_class = model.predict(data)
        labels = {1: 'Benign lesions of the keratosis', 2: 'Dermatofibroma' , 3:'Melanoma' , 4:'Melanocytic nevi' , 5:'Vascular lesions' , 6:'Basal cell carcinoma' , 7: 'Actinic keratoses and intraepithelial carcinoma' , 8:'Normal'}
        predicted_label = labels.get(predicted_class[0], 'Unknown')
        return jsonify({'success': True, 'message': 'Image processed successfully', 'predicted_class': predicted_label}), 200
    except RuntimeWarning as rw:
        print(f"Runtime warning encountered: {rw}")
        return jsonify({'warning': str(rw), 'success': False, 'message': 'Image processed with warning'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)