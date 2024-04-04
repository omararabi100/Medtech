import React, { useState, useEffect } from "react";
import $ from "jquery";

const GetChecked = () => {
    const [image, setImage] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showLoginMessage, setShowLoginMessage] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [predictedClass, setPredictedClass] = useState("");
    const IsLogged = localStorage.getItem("Islogged");
    let email = localStorage.getItem("email");
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    email = email.replace(/"/g, '');
    console.log(localStorage);

    const handleChange = (event) => {
        const file = event.target.files[0]; 
    
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setSelectedFile(event.target.files[0]);
            setImage(file); 
        }
    };

    const handleClearImage = () => {
        setSelectedImage(null);
        setSelectedFile(null);
        setImage(null);
        setPredictedClass(""); 
        setShowError(false); 
        setShowSuccessMessage(false); 
        setSuccessMessage("")
        
    };

    const handleUploadClick = () => {
        if (IsLogged !== "true") {
            setShowLoginMessage(true);
        } else {
            if (!image) {
                setShowError(true);
                return;
            }

            uploadImage();
        }
    };

    const executePythonCode = async () => {
        const formData = new FormData();
        formData.append('image', selectedFile);

        $.ajax({
            url: 'http://localhost:5000/app',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: (response) => {
                console.log(response);
                setPredictedClass(response.predicted_class);
                setShowSuccessMessage(true);
                setSuccessMessage('Image processed successfully');
            },
            error: (error) => {
                console.error('Error processing image:', error);
            }
        });
    };

    const uploadImage = () => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("image", image);

        $.ajax({
            url: "http://localhost:8000/uploadimage.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                setShowSuccessMessage(true);
                setSuccessMessage("Image uploaded successfully");

                // Call the Python code here
                executePythonCode();
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
                setShowSuccessMessage(true);
                setSuccessMessage("Failed to upload image");
            }
        });
    };

    useEffect(() => {
        if (showSuccessMessage) {
            const timer = setTimeout(() => {
                setShowSuccessMessage(false);
                setSuccessMessage("");
            }, 30000);

            return () => clearTimeout(timer);
        }
    }, [showSuccessMessage]);

    return (
        <div className="Getchecked">
            <div className="image_placeholder" onClick={() => IsLogged ? document.getElementById('imageInput').click() : null}>
                {selectedImage ? (
                    <img src={selectedImage} alt="Uploaded" />
                ) : (
                    <p>Click to upload an image</p>
                )}
            </div>
            <input
                id="imageInput"
                type="file"
                name="image"
                accept="image/png, image/jpeg"
                onChange={handleChange}
                style={{ display: 'none' }}
            />
            <div className="buttons">
                {image && ( 
                    <button onClick={handleClearImage}>
                        Clear
                    </button>
                )}
                <button onClick={handleUploadClick}>Upload</button>
            </div>
            <div className="results">
                {showError && (
                    <p style={{ color: 'red' }}>An image must be uploaded</p>
                )}
                {showLoginMessage && (
                    <p style={{ color: 'red' }}>Please login to upload</p>
                )}
                {showSuccessMessage && (
                    <span style={{ color: 'green' }}>{successMessage}</span>
                )}

                {predictedClass && (
                    <p>{predictedClass}</p>
                    )}
            </div>
        </div>
    );
};

export default GetChecked;
