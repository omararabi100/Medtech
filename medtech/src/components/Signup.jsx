import React, { useState } from "react";
import $ from "jquery";

const Signup = ({ openLogin , onSign, closePopups  }) => {
    const [formdata, setFormdata] = useState({
        full_name: "",
        email: "",
        password: "",
        phone_nb: "",
    });
    const [errors, setErrors] = useState({
        fullnameError: false,
        emailError: false,
        passwordError: false,
        phoneError: false,
        errorMessage: "",
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setFormdata(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [`${name}Error`]: false, // Reset error when input changes
        }));
    }
    
    

    function handleSubmit(event) {
        event.preventDefault();
        const { full_name, email, password, phone_nb } = formdata;

        // Reset errors
        setErrors({
            fullnameError: false,
            emailError: false,
            passwordError: false,
            phoneError: false,
            errorMessage: "",
        });

        // Check for empty fields
        if (!full_name || !email || !password || !phone_nb) {
            setErrors({
                ...errors,
                errorMessage: "All fields are required",
            });
            return;
        }

        // Perform form submission
        $.ajax({
            type: "POST",
            url: "http://localhost:8000/signup.php",
            data: formdata, // Pass formdata directly
            success(data) {
                if (data.error) {
                    setErrors({
                        ...errors,
                        errorMessage: data.error,
                    });
                } else {
                    console.log(data.full_name);
                    console.log(data);
                    onSign(data.full_name);
                    closePopups();
                }
            },
            error: function(error) {
                console.error("Error:", error);
                setErrors({
                    ...errors,
                    errorMessage: "Email already exists",
                });
            },
        });
        
        
    }

    return (
        <div>
            <h1>Sign Up</h1>
            <form 
                action="http://localhost:8000/signup.php"
                method="post"
                onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Full name"
                    name="full_name"
                    onChange={handleChange}
                    value={formdata.full_name}
                />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    value={formdata.email}
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    value={formdata.password}
                />
                <input
                    type="tel"
                    placeholder="Phone"
                    name="phone_nb"
                    onChange={handleChange}
                    value={formdata.phone_nb}
                />
                {errors.errorMessage && <div style={{ color: "red" }}>{errors.errorMessage}</div>}
                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account?
                <br />
                <a href="#" onClick={openLogin}>
                    Log In
                </a>
            </p>
        </div>
    );
};

export default Signup;
