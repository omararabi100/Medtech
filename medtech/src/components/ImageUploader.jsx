import React, { useState ,useEffect  } from "react";

const ImageUploader = ({ handleImageChange, formData , editMode }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    useEffect(() => {
        if (editMode) {
            const imageFormat = formData.image.endsWith('.jpg') || formData.image.endsWith('.jpeg') ? 'jpeg' : 'png';
            setSelectedImage(`data:image/${imageFormat};base64,${formData.image}`);
        }
    }, [formData.image]);
    const handleChange = (event) => {
        const file = event.target.files[0];
        console.log("Selected file:", file);

        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            handleImageChange(event); // Pass the event object to the parent component
        }
    };

    return (
        <label htmlFor="image">
            <div className="image-container">
                {formData.image ? (
                    <img src={selectedImage} className="placeholder" alt="Selected" />
                ) : (
                    <img name='image' className="placeholder" src="./public/Portrait_Placeholder.png" alt="Selected" />
                )}
            </div>
            <input
                id="image"
                type="file"
                name="image"
                accept="image/png, image/jpeg"
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        </label>
    );
};

export default ImageUploader;
