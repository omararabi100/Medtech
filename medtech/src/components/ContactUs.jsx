import React from "react";

const ContactUs = () => {
    return (
        <div className="contact-us-container">
            <form action="">
                <input type="text" placeholder="Email"/>
                <input type="text" placeholder="First Name"/>
                <input type="text" placeholder="Last Name"/>
                <textarea cols="30" rows="10"></textarea>
            </form>
        </div>
    )
}

export default ContactUs