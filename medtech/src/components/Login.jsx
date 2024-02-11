import React, { useState } from "react";
import $ from "jquery";

const Login = ({ openSignup, onLogin, closePopups }) => {
    const [formdata, setformdata] = useState({
        email: "",
        password: "",
    });
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [allFieldsEmptyError, setAllFieldsEmptyError] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;
        setformdata(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
        
    }

    function handleSubmit(event) {
        event.preventDefault();
        const { email, password } = formdata;
        // Reset errors
        setEmailError(false);
        setPasswordError(false);
        setErrorMessage("");
        
        // Check if all fields are empty
        if (email === "" && password ==="") {
            setAllFieldsEmptyError(true);
        } else {
            setAllFieldsEmptyError(false);
        }
    
        $.ajax({
            type: "POST",
            url: "http://localhost:8000/server.php",
            data: $(event.target).serialize(),
            success(data) {
                if (data.error && !setAllFieldsEmptyError) {
                    if (data.error === "Invalid email") {
                        setEmailError(true);
                        setErrorMessage("Email is incorrect.");
                    } else if (data.error === "Invalid password") {
                        setPasswordError(true);
                        setErrorMessage("Password is incorrect.");
                    }
                } else {
                    onLogin(data.name);
                    closePopups();
                }
            },
            error(err) {
                console.error("Error:", err);
                if (err.status === 401) {
                    setPasswordError(true);
                    setErrorMessage("Password is incorrect.");
                } 
                else if (err.status === 400) {
                    setEmailError(true);
                    setErrorMessage("Email is incorrect.");
                } 
                else {
                    alert("An error occurred. Please try again later.");
                }
            },
        });
    }
    
    return (
        <div>
            <h1>Login</h1>
            <form
                action="http://localhost:8000/server.php"
                method="post"
                onSubmit={handleSubmit}
            >
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    value={formdata.email}
                    style={{ borderColor: emailError ? "red" : "" }}
                />
                {allFieldsEmptyError? null:emailError && <div style={{ color: "red" }}>{errorMessage}</div>}
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    value={formdata.password}
                    style={{ borderColor: passwordError ? "red" : "" }}
                />
                {allFieldsEmptyError? null: passwordError && <div style={{ color: "red" }}>{errorMessage}</div>}
                {allFieldsEmptyError && <div style={{ color: "red" }}>All fields are empty.</div>}
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account?
                <br />
                <a href="#" onClick={openSignup}>
                    Sign Up
                </a>
            </p>
        </div>
    );
};

export default Login;
