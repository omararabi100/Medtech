import React, { useState, useEffect } from "react";

const GetChecked = () => {
    const [image, setImage] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showLoginMessage, setShowLoginMessage] = useState(false);
    const IsLogged = localStorage.getItem("Islogged");
    let email = localStorage.getItem("email");
    const [selectedImage, setSelectedImage] = useState(null);
    email = email.replace(/"/g, '');

    const handleChange = (event) => {
        const file = event.target.files[0]; 
    
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setImage(file); 
        }
    };
    

    const handleClearImage = () => {
        setImage(null);
    };

    const handleUploadClick = () => {
        if (IsLogged !== "true") {
            setShowLoginMessage(true);
        } else {
            if (!image) {
                setShowError(true);
                return;
            }

            const formData = new FormData();
            formData.append("email", email);
            formData.append("image", image);

            fetch("http://localhost:8000/uploadimage.php", {
                method: "POST",
                body: formData,
            })
            .then(response => {
                if (response.ok) {
                    console.log("Upload success");
                } else {
                    throw new Error("Upload failed");
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        }
    };

    useEffect(() => {
        // Cleanup logic if needed
        return () => {
            // Cleanup code
        };
    }, []);

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
                {showError && (
                    <p style={{ color: 'red' }}>An image must be uploaded</p>
                )}
                {showLoginMessage && (
                    <p style={{ color: 'red' }}>Please login to upload</p>
                )}
            </div>
        </div>
    );
};

export default GetChecked;
