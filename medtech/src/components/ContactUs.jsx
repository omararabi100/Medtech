import React, { useState } from "react";
import { images } from "../../image";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        email: "",
        fname: "",
        lname: "",
        msg: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState(false)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const validateEmail = (email) => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        
        let hasError = false;
    
        if (!formData.email) {
            setErrorMessage("Email is required.");
            hasError = true;
        }
        else if (validateEmail(formData.email) === false){
            setErrorMessage("Please provide a valid email address.");
            hasError = true;
        }
        else if (!formData.fname) {
            setErrorMessage("First name is required.");
            hasError = true;
        }
        else if (!formData.lname) {
            setErrorMessage("Last name is required.");
            hasError = true;
        }
        else if (!formData.msg) {
            setErrorMessage("Message is required.");
            hasError = true;
        }
        else {
            setErrorMessage("");
            hasError = false;
        }
    
        setError(hasError);
    
        // Submit the form if no errors
        if (!hasError) {
            const form = e.target;
            form.submit();
        }
    };
    return (
        <>
            <h1 className="contact-us-title"><span>Contact Us</span></h1>
            <div className="contact-us-container">
                <form action="http://localhost:8000/sendEmail.php" method="post" onSubmit={handleSubmit}>
                    <input className="email-input" type="text" placeholder="Email" name="email" onChange={handleChange}/>
                    <div className="name-container">
                        <input type="text" placeholder="First Name" name="fname" onChange={handleChange}/>
                        <input type="text" placeholder="Last Name" name="lname" onChange={handleChange}/>
                    </div>
                    <textarea cols="30" rows="10" placeholder="Your Message" className="txt-area-msg" name="msg" onChange={handleChange}></textarea>
                    <button className="send-btn" type="submit">SEND</button>
                    {error && <div className="error">{errorMessage}</div>}
                </form>
                <img className="home-container-description-img" src={images.Doctor} alt="" />
            </div>
        </>
    )
}

export default ContactUs