import React, { useState } from "react";
import Login from './Login';

const GetChecked = () => {

    const [imageUrl, setImageUrl] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showLoginMessage, setShowLoginMessage] = useState(false);

    const IsLogged = localStorage.getItem("Islogged");
    const patient_id = localStorage.getItem("patient_id");

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
            setShowError(false); 
        }
    };

    const handleClearImage = () => {
        setImageUrl(null);
    };

    const handleUploadClick = () => {

        console.log(IsLogged);
        
        if (IsLogged !== "true") {
            setShowLoginMessage(true); 
        } else {
            if (!imageUrl) {
                setShowError(true); 
            } 
            console.log(IsLogged);
            $.ajax({
                type: "POST",
                url: "http://localhost:8000/uploadimage.php",
                data: formdata, // Pass formdata directly
                success(data) {
                    if (data.error) {
                        setErrors({
                            ...errors,
                            errorMessage: data.error,
                        });
                    } else {
                        console.log(data.full_name);
                        console.log(data);
                        onSign(data.full_name);
                        closePopups();
                    }
                },
                error: function(error) {
                    console.error("Error:", error);
                    setErrors({
                        ...errors,
                        errorMessage: "Email already exists",
                    });
                },
            });
            // fetch('addimage.php', {
            //     method: 'POST',
            //     body: JSON.stringify({ image: imageUrl }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // })
            // .then(response => {
            //     // Handle response
            // })
            // .catch(error => {
            //     console.error('Error:', error);
            // });
        }
    };

    return (
        <div className="Getchecked">
            
            <div className="image_placeholder" onClick={() => IsLogged ? document.getElementById('imageInput').click() : null}>
                {imageUrl ? (
                    <img src={imageUrl} alt="Uploaded"  />
                ) : (
                    <p>Click to upload an image</p>
                )}
            </div>
            
            <input type="file" accept="image/*" id="imageInput" style={{ display: "none" }} onChange={handleImageChange} />
            <div className="buttons">
                {imageUrl && ( 
                    <button onClick={handleClearImage}>
                        Clear
                    </button>
                )}
                {IsLogged ? (
                    <label htmlFor="imageInput">
                        <button onClick={handleUploadClick}>Upload</button>
                    </label>
                ) : (
                    <span style={{ color: 'red', marginRight: '10px' }}>Please login to upload</span>
                )}
                {showError && (
                    <p style={{ color: 'red' }}>An image must be uploaded</p>
                )}
                {showLoginMessage && (
                    <p style={{ color: 'red' }}>Please login to upload</p>
                )}
            </div>
        </div>
    )
}

export default GetChecked;
