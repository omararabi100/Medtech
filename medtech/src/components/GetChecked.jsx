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
                    <div>
                        <p>You have a chance of 88% to have a {predictedClass}</p>
                        {predictedClass === 'Benign lesions of the keratosis' && (
                            <p>
                                Benign lesions of the keratosis refers to non-cancerous growths or abnormalities in the skin characterized by excess keratin production. These lesions can include various types of skin conditions such as seborrheic keratosis, keratosis pilaris, or actinic keratosis. Although generally harmless, they can sometimes resemble malignant lesions, highlighting the importance of proper diagnosis and monitoring by a healthcare professional.
                            </p>
                        )}
                        {predictedClass === 'Dermatofibroma' && (
                            <p>
                                Dermatofibroma is a common benign skin lesion that typically presents as a small, firm, raised bump on the skin. It often appears on the legs, though it can occur elsewhere on the body. Dermatofibromas are usually reddish-brown or skin-colored and may have a slightly dimpled or depressed center when pinched. They are generally harmless and don't require treatment unless they cause symptoms or cosmetic concerns. Biopsy may be necessary to confirm the diagnosis and rule out other skin conditions.
                            </p>
                        )}{predictedClass === 'Melanoma' && (
                            <p>
                                Melanoma is a type of skin cancer that originates from melanocytes, which are pigment-producing cells in the skin. It often appears as a new spot or a change in an existing mole. Melanomas can vary in appearance but are typically irregularly shaped, with uneven borders, and may have different colors within the lesion (such as brown, black, red, blue, or white). They can develop anywhere on the skin, including areas not exposed to the sun. Melanoma is considered a serious form of skin cancer and requires prompt medical attention for diagnosis and treatment to prevent its spread to other parts of the body. Early detection and treatment significantly improve outcomes for patients with melanoma.
                            </p>
                        )}{predictedClass === 'Melanocytic nevi' && (
                            <p>
                                Melanocytic nevi, commonly known as moles, are benign growths on the skin composed of melanocytes, which are pigment-producing cells. These nevi can vary in size, color, and appearance, ranging from flat, small spots to raised, darker lesions. Most melanocytic nevi are harmless and do not require treatment unless they change in size, shape, or color, which could indicate a risk of melanoma. Regular monitoring of moles is recommended to detect any changes that may warrant further evaluation by a dermatologist.
                            </p>
                        )}{predictedClass === 'Vascular lesions' && (
                            <p>
                                Vascular lesions refer to abnormalities or growths in blood vessels that can appear on the skin. These lesions can manifest in various forms, including birthmarks (such as port-wine stains or hemangiomas), telangiectasias (dilated blood vessels), or vascular malformations (abnormalities in the formation of blood vessels). Vascular lesions can be red, purple, or blue in color and may be flat or raised. Some vascular lesions are present at birth, while others develop over time. Treatment options for vascular lesions depend on the type, size, and location of the lesion, and can include laser therapy, sclerotherapy, or surgical removal. Regular evaluation by a dermatologist or vascular specialist is recommended for proper diagnosis and management of vascular lesions.
                            </p>
                        )}{predictedClass === 'Basal cell carcinoma' && (
                            <p>
                                Basal cell carcinoma (BCC) is the most common type of skin cancer, typically originating from the basal cells of the epidermis, the outermost layer of the skin. It usually appears as a slow-growing, flesh-colored, pearl-like bump or a pinkish patch of skin. BCC often develops on sun-exposed areas like the face, ears, neck, and scalp. While it rarely metastasizes (spreads to other parts of the body), it can cause significant local damage if left untreated. Treatment options include surgical excision, Mohs surgery, topical therapies, and radiation therapy, with a high cure rate if detected and treated early. Regular skin checks are important for individuals at risk of BCC due to sun exposure or other factors.
                            </p>
                        )}{predictedClass === 'Actinic keratoses and intraepithelial carcinoma' && (
                            <p>
                                Actinic keratoses (AK) are precancerous skin lesions caused by prolonged sun exposure, appearing as rough, scaly patches on sun-exposed areas. While not invasive cancers, AKs can progress to squamous cell carcinoma (SCC).

                                Intraepithelial carcinoma (or SCC in situ) is an early form of squamous cell carcinoma, characterized by abnormal growth confined to the skin's top layer. It presents as a red, scaly patch.

                                Both AKs and intraepithelial carcinoma require evaluation and treatment to prevent skin cancer. Options include cryotherapy, topical medications, laser therapy, or surgical removal. Regular skin checks and sun protection are crucial for prevention.
                            </p>
                        )}
                    </div>
                    )}
            </div>
        </div>
    </div>
    
    );
};

export default GetChecked;
