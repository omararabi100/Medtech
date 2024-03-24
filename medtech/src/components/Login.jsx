import React, { useState, useEffect } from "react";
import $ from "jquery";
import { useNavigate } from "react-router-dom";

const Login = ({ openSignup, onLogin, closePopups, isDrOpen, setIsDrOpen, formdata, setformdata }) => {
  const navigate = useNavigate(); // Hook for navigation

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [allFieldsEmptyError, setAllFieldsEmptyError] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setformdata((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function openlog() {
    setIsDrOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const { email, password, id, full_name } = formdata;
    // history.push(`/my-profile/${email}`);

    // Reset errors
    setEmailError(false);
    setPasswordError(false);
    setErrorMessage("");
    if (isDrOpen) {
        if (id === "" || full_name === "") {
            setAllFieldsEmptyError(true);
            return; // Exit early if fields are empty
        } else {
            setAllFieldsEmptyError(false);
        }
    } else {
        if (email === "" || password === "") {
            setAllFieldsEmptyError(true);
            return; // Exit early if fields are empty
        } else {
            setAllFieldsEmptyError(false);
        }
    }
    
      
    

    const url = isDrOpen ? "http://localhost:8000/getdrlog.php" : "http://localhost:8000/server.php";

    $.ajax({
      type: "POST",
      url: url,
      data: $(event.target).serialize(),
      success(data) {
            // console.log(data);
            // console.log(data.data.full_name);
            // console.log(data.type);
        if (data.error) {
          if (data.error === "Invalid email") {
            setEmailError(true);
            setErrorMessage("Email is incorrect.");
          } else if (data.error === "Invalid password") {
            setPasswordError(true);
            setErrorMessage("Password is incorrect.");
          }
          else if (data.error === "Invalid full name"){
            setEmailError(true);
            setErrorMessage("Name is incorrect.");
          }
          else if (data.error === "Invalid full name and ID"){
            setEmailError(true);
            setErrorMessage("Invalid full name and ID");
          }
        
        } else {
            if (data.full_name === "Admin" ||data.full_name ==="Admin User") {
                onLogin(data.full_name ,"Admin"  )
                navigate(`/admin-page`);

            } else if (data.type ==='Doctor') {
                onLogin(data.data.full_name , "Doctor");
                navigate(`/dr-page`);

            }
            else{
                onLogin(data.full_name ,"User"  )
                navigate(`/my-profile`);
            }
            closePopups();
        }
      },
      error(err) {
        console.error("Error:", err);
        if (err.status === 401) {
          setPasswordError(true);
          setErrorMessage("Password is incorrect.");
        } else if (err.status === 400) {
          setEmailError(true);
          setErrorMessage("Email is incorrect.");
        } else {
          alert("An error occurred. Please try again later.");
        }
      },
    });
  }

  function opendr() {
    setIsDrOpen(true);
    setformdata({
      email: "",
      password: "",
      full_name: "",
      id: "",
    });
  }
  useEffect(() => {
    const savedFormData = localStorage.getItem(formdata);
    if (savedFormData) {
      setformdata(JSON.parse(savedFormData));
    }
  }, []);

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {isDrOpen ? (
          <>
            <input
              type="text"
              placeholder="Full name"
              name="full_name"
              onChange={handleChange}
              value={formdata.full_name}
              style={{ borderColor: emailError ? "red" : "" }}
            />

            <input
              type="password"
              placeholder="ID"
              name="id"
              onChange={handleChange}
              value={formdata.id}
              style={{ borderColor: passwordError ? "red" : "" }}
            />
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={formdata.email}
              style={{ borderColor: emailError ? "red" : "" }}
            />
            {emailError && <div style={{ color: "red" }}>{errorMessage}</div>}

            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={formdata.password}
              style={{ borderColor: passwordError ? "red" : "" }}
            />
            {passwordError && <div style={{ color: "red" }}>{errorMessage}</div>}
          </>
        )}

        {allFieldsEmptyError && <div style={{ color: "red" }}>All fields are empty.</div>}

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account?
        <br />
        <a href="#" onClick={openSignup}>
          Sign Up
        </a>
        <br />
        {isDrOpen ? (
          <a href="#" onClick={openlog}>
            Login as patient
          </a>
        ) : (
          <a href="#" onClick={opendr}>
            Doctor login
          </a>
        )}
      </p>
    </div>
  );
};

export default Login;
