import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

const Header = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    const toggleLogin = () => {
        setIsLoginOpen(!isLoginOpen);
        if (isSignupOpen) setIsSignupOpen(false);
    };

    const toggleSignup = () => {
        setIsSignupOpen(!isSignupOpen);
        if (isLoginOpen) setIsLoginOpen(false);
    };

    const closePopups = () => {
        setIsLoginOpen(false);
        setIsSignupOpen(false);
    };

    return (
        <div className="Header-container">
            <div className="nav-bar">
                <h2>Med<span>Tech</span></h2>
                <div className="nav-content">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/risk-prediction-tool">Risk Prediction Tool</Link></li>
                        <li><Link to="/get-checked">Get Checked</Link></li>
                        <li><Link to="/call-now">Call Now</Link></li>
                        <li><Link to="/about-us">About Us</Link></li>
                        <li><Link to="/contact-us">Contact</Link></li>
                        <li>dsjchvgfv</li>
                    </ul>
                    <div>
                        <button className="login-btn" onClick={toggleLogin}>LogIn</button>
                        <button className="signup-btn" onClick={toggleSignup}>SignUp</button>
                    </div>
                </div>
            </div>
            {(isLoginOpen || isSignupOpen) && (
                <div className="popup-overlay" onClick={closePopups}>
                    <div className="popup-section" onClick={(e) => e.stopPropagation()}>
                        <div className="popup-content">
                            {isLoginOpen && (
                                <div key="login">
                                    <Login openSignup={toggleSignup}/>
                                </div>
                            )}
                            {isSignupOpen && (
                                <div key="signup">
                                    <Signup openLogin={toggleLogin} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;
