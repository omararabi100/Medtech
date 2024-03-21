import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Login from "./Login";
import Signup from "./Signup";

const Header = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isDrOpen, setIsDrOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);
    const [name, setName] = useState(""); 

    const [formdata, setformdata] = useState({
        
    });
    // const [contactInfo, setContactInfo] = useState({});

    const navigate = useNavigate(); // Initialize useNavigate

    const toggleLogin = () => {
        setIsLoginOpen(!isLoginOpen);
        if (isSignupOpen) setIsSignupOpen(false);
    };

    const toggleSignup = () => {
        setIsSignupOpen(!isSignupOpen);
        if (isLoginOpen) {
            setIsLoginOpen(false) ;
        setisDrOpen(false)
        }
    };

    const closePopups = () => {
        setIsLoginOpen(false);
        setIsSignupOpen(false);
        setIsDrOpen(false);
        setformdata({
            email: "",
            password: "",
            full_name: "",
            id: "",
        });
    
    };

const handleLogin = (userData , type,email) => {
    if (type === "Doctor") {
      setUser("Doctor");
      localStorage.setItem("user", "Doctor" , email);
    } else if (type === "Admin") {
      setUser("Admin");
      localStorage.setItem("user", "Admin");
    } else {
      setUser("User");
      localStorage.setItem("user", "User",email );
    }
    // console.log(formdata.email);
    setName(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("email", JSON.stringify(formdata.email));
    console.log(localStorage);
    // console.log("userData");
    // console.log(userData);

};

    
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/"); // Navigate to the home page after logout
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);
    const storedname = localStorage.getItem('userData');

    return (
        <div className="Header-container">
            <div className="nav-bar">
                <h2>Med<span>Tech</span></h2>
                <div className="nav-content">
                    <ul>
                    {user !== "Admin" && user !== "Doctor" && (
                            <>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/risk-prediction-tool">Risk Prediction Tool</Link></li>
                                <li><Link to="/get-checked">Get Checked</Link></li>
                                <li><Link to="/call-now">Call Now</Link></li>
                                <li><Link to="/about-us">About Us</Link></li>
                                <li><Link to="/contact-us">Contact</Link></li>
                            </>
                        )}
                        {user && (
                            <ul>
                                {user=== "Doctor" && (
                                <li><Link to="/dr-page">Doctor Page</Link></li>
                                )}
                                {user === "Admin" && (
                                <li><Link to="/admin-page">Admin Page</Link></li>
                                )}
                                {(user !== "Doctor" && user!== "Admin") && (
                                <li><Link to="/my-profile">My Profile</Link></li>
                                )}
                            </ul>
                            )}

                        </ul>
                    {user ? (
                        <div>
                            <div>

                            <p>Hello, {storedname}!</p>
                            </div>
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
            {(isLoginOpen || isSignupOpen ) && (
                <div className="popup-overlay" onClick={closePopups}>
                    <div className="popup-section" onClick={(e) => e.stopPropagation()}>
                        <div className="popup-content">
                            {isLoginOpen && (
                                <div key="login">
                                    <Login openSignup={toggleSignup} isDrOpen={isDrOpen} setIsDrOpen = {setIsDrOpen} onLogin={handleLogin} closePopups={closePopups} formdata={formdata} setformdata={setformdata}/>
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
