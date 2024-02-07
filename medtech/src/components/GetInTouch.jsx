import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope , FaPhoneAlt , FaFacebookSquare , FaTwitter , FaInstagram} from "react-icons/fa";
import { IconContext } from "react-icons";

const Getintouch = () => {
    return (
        <IconContext.Provider value={{color:'var(--maincolor)'}}>
        <div>
            <h4>Get In Touch</h4>
            <ul>
                <li className="link phone">
                    <FaPhoneAlt />
                    <Link to="">76 056 804</Link>
                </li>
                <li className="link mail">
                    <FaEnvelope />
                    <Link to="">faomar@gmail.com</Link>
                </li>
                <div className="icons-div">
                    <FaFacebookSquare />
                    <FaInstagram />
                    <FaTwitter />
                </div>
            </ul>
        </div>
        </IconContext.Provider>
    )
}

export default Getintouch