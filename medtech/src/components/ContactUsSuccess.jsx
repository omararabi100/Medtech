import React from "react";
import { Link } from "react-router-dom";

const ContactUsSuccess = () => {
    return (
        <div className="contact-us-success-container">
            <h1>Message Sent Successfully</h1> <br /> 
            <h1>Thank You</h1>
            <button><Link to="/contact-us">Return</Link></button>
        </div>
    )
}

export default ContactUsSuccess