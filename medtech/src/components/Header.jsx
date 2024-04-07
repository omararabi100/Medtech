import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Login from "./Login";
import Signup from "./Signup";

const Header = ({showHide, showLoginPopup}) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isDrOpen, setIsDrOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);
    const [name, setName] = useState(""); 
    const [Islogged , setIsLogged] = useState(false);

    const [formdata, setformdata] = useState({
        
    });
    // const [contactInfo, setContactInfo] = useState({});

    const navigate = useNavigate(); // Initialize useNavigate
    const initialRender = useRef(true);
    useEffect(()=>{
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        toggleLogin();
    },[showLoginPopup]);
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

const handleLogin = (userData , type,email,id) => {
    if (type === "Doctor") {
        setUser("Doctor");
        localStorage.setItem("user", "Doctor" , email,id);
    } else if (type === "Admin") {
        setUser("Admin");
        localStorage.setItem("user", "Admin");
    } else {
        setUser("User");
        localStorage.setItem("user", "User",email );
    }
    setName(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("Islogged" , true) ;
    localStorage.setItem("email", JSON.stringify(formdata.email));
    localStorage.setItem("patient_id", JSON.stringify(formdata.id));
    localStorage.setItem("dr_id", JSON.stringify(formdata.id));
    localStorage.setItem("dr_id_pure", JSON.stringify(id));

};

    
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/");
    localStorage.setItem("Islogged" , false) ;

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
                <img src="https://cdn-icons-png.flaticon.com/512/2099/2099192.png" className='logo-list' onClick={showHide} />
                <h2>Med<span>Tech</span></h2>
                <div className="nav-content">
                    <ul>
                    {user !== "Admin" && user !== "Doctor" && (
                            <>
                                <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
                                <li><Link to="/risk-prediction-tool" className={location.pathname === '/risk-prediction-tool' ? 'active' : ''}>Risk Prediction Tool</Link></li>
                                <li><Link to="/get-checked" className={location.pathname === '/get-checked' ? 'active' : ''}>Get Checked</Link></li>
                                <li><Link to="/call-now" className={location.pathname === '/call-now' ? 'active' : ''}>Call Now</Link></li>
                                <li><Link to="/about-us" className={location.pathname === '/about-us' ? 'active' : ''}>About Us</Link></li>
                                <li><Link to="/contact-us" className={location.pathname === '/contact-us' ? 'active' : ''}>Contact</Link></li>
                            </>
                        )}
                        {user && (
                            <>
                                {user=== "Doctor" && (
                                    <>
                                    <li><Link to="/dr-page" className={location.pathname === '/dr-page' ? 'active' : ''}>Doctor Page</Link></li>
                                    <li><Link to="/calendar" className={location.pathname === '/calendar' ? 'active' : ''}>Calendar</Link></li>
                                    </>
                                )}
                                {user === "Admin" && (
                                <li><Link to="/admin-page" className={location.pathname === '/admin-page' ? 'active' : ''}>Admin Page</Link></li>
                                )}
                                {(user !== "Doctor" && user!== "Admin") && (
                                <li><Link to="/my-profile" className={location.pathname === '/my-profile' ? 'active' : ''}>My Profile</Link></li>
                                )}
                            </>
                            )}

                        </ul>
                </div>
                {user ? (
                    <div className="user-info">
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div className="login-signup-container">
                        <button className="login-btn" onClick={toggleLogin}>LogIn</button>
                        <button className="signup-btn" onClick={toggleSignup}>SignUp</button>
                    </div>
                )}
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
