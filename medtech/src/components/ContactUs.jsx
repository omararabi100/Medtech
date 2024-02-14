import React from "react";
import { images } from "../../image";

const ContactUs = () => {
    const hello = "hello"
    return (
        <>
            <h1 className="contact-us-title"><span>Contact Us</span></h1>
            <div className="contact-us-container">
                <form action="">
                    <input className="email-input" type="text" placeholder="Email"/>
                    <div className="name-container">
                        <input type="text" placeholder="First Name"/>
                        <input type="text" placeholder="Last Name"/>
                    </div>
                    <textarea cols="30" rows="10" placeholder="Your Message" className="txt-area-msg"></textarea>
                    <button className="send-btn">SEND</button>
                </form>
                <img className="home-container-description-img" src={images.Doctor} alt="" />
            </div>
        </>
    )
}

export default ContactUs