// Login.jsx
import React from "react";
import $ from "jquery";

const Login = ({ openSignup }) => { // Destructure props object to access openSignup function
    
    const [formdata, setformdata] = React.useState({
        email:"" , 
        password :"",

    })

    function handlechange(event) {
        const { name, value } = event.target;
        setformdata((prevformdata) => ({
            ...prevformdata,
            [name]: value,
        }));
        console.log(formdata)

    }
    
    function handlesubmit(event){
        if(email === 0){
            alert("email is left blank ")
        }
        if(password === 0){
            alert("password is left blank ")
        }
        else{
            alert("all fields are empty")
        }
        event.preventDefault();
        const form = $(e.target);
        $.ajax({
            type: "POST",
            url: form.attr("action"),
            data: form.serialize(),
            success(data) {
                setResult(data);
            },
        });
    }
    return (
        <div>
            <h1>Login</h1>
            <form action="http://localhost:8000/server.php"
                method="post"
                onSubmit={(event) => handleSubmit(event)}>
                <input 
                    type="email"
                    placeholder="email"
                    name="email"
                    onChange={handlechange}
                    value={formdata.email}
                    />                <input 
                    type="password"
                    placeholder="Password "
                    name="password"
                    onChange={handlechange}
                    value={formdata.password}
                    />                
                    <button>LogIn</button>
            </form>
            <p>Don't have an account?
                <br />
                <a href="#" onClick={openSignup}>Sign Up</a></p>
        </div>
    );
}

export default Login;
