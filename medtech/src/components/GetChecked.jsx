import React, { useState, useEffect } from "react";
import $ from "jquery";

const GetChecked = ({ toggleLoginPopup }) => {
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
    email && (email = email.replace(/"/g, ''));

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
            toggleLoginPopup();
            setShowLoginMessage(true);
        } else {
            if (!image) {
                setShowError(true);
                return;
            }
            setShowError(false);
            setShowSuccessMessage(false);
            setSuccessMessage("");
            setPredictedClass("");
            $.ajax({
                url: "http://localhost:8000/getUserProfile.php",
                type: "POST",
                data: { email: email },
                success: function(response) {
                    console.log("User information:", response);
                    const gender = response.gender ; 
                    const dateOfBirth = response.dateofbirth;
                    const age = calculateAge(dateOfBirth); 
                    executePythonCode(gender, age);

                },
                error: function(xhr, status, error) {
                    console.error("Error fetching user information:", error);
                }
            });

            // uploadImage();
        }
    };
    const calculateAge = (dateOfBirth) => {
        const dob = new Date(dateOfBirth);
    
        const currentDate = new Date();
    
        let age = currentDate.getFullYear() - dob.getFullYear();
    
        if (currentDate.getMonth() < dob.getMonth() || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
            age--;
        }
    
        return age;
    };
    const executePythonCode = async (gender, age) => {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('gender', gender);
        formData.append('age', age);
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
                // const predicted_class = predictedClass ; // Remove this line
                addPredictedClassToDatabase(response.predicted_class); // Use response.predicted_class directly
            },
            error: (error) => {
                console.error('Error processing image:', error);
            }
        });
    };
    
    const addPredictedClassToDatabase = (predicted_class) => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("image", image);
        formData.append("predicted_class", predicted_class);
    
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
                // executePythonCode(gender, age);
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
    <div>
        <div className="Instructions">
            <h2>Instructions</h2>
                <ol>
                    <li>Make sure to take a pisture of the desired are only </li>
                    <li>Add flashlight</li>
                    <li>Make sure your image is less than 1MB </li>
                </ol>
            </div>
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
                    <p>You have a chance of 88% to have a {predictedClass}</p>
                    )}
            </div>
        </div>
    </div>
    
    );
};

export default GetChecked;
