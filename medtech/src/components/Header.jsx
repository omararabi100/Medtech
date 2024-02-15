import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Login from "./Login";
import Signup from "./Signup";

const Header = ({showHide}) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

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

    const handleLogin = (username) => {
        setUser(username);
        localStorage.setItem("user", username);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/"); // Navigate to the home page after logout
    };

    useEffect(() => {
        // Check if user is already logged in on page load
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <div className="Header-container">
            <div className="nav-bar">
                {/* <button onClick={showHide}>O</button> */}
                <h2>Med<span>Tech</span></h2>
                <div className="nav-content">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/risk-prediction-tool">Risk Prediction Tool</Link></li>
                        <li><Link to="/get-checked">Get Checked</Link></li>
                        <li><Link to="/call-now">Call Now</Link></li>
                        <li><Link to="/about-us">About Us</Link></li>
                        <li><Link to="/contact-us">Contact</Link></li>
                        {user && user === "Admin" && <li><Link to="/admin-page">Admin Page</Link></li>}
                    </ul>
                    {user ? (
                        <div>
                            <p>Hello, {user}!</p>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <div>
                            <button className="login-btn" onClick={toggleLogin}>LogIn</button>
                            <button className="signup-btn" onClick={toggleSignup}>SignUp</button>
                        </div>
                    )}
                </div>
            </div>
            {(isLoginOpen || isSignupOpen) && (
                <div className="popup-overlay" onClick={closePopups}>
                    <div className="popup-section" onClick={(e) => e.stopPropagation()}>
                        <div className="popup-content">
                            {isLoginOpen && (
                                <div key="login">
                                    <Login openSignup={toggleSignup} onLogin={handleLogin} closePopups={closePopups}/>
                                </div>
                            )}
                            {isSignupOpen && (
                                <div key="signup">
                                    <Signup openLogin={toggleLogin} onSign={handleLogin} closePopups={closePopups}  />
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
