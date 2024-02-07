// Signup.jsx
import React from "react";

const Signup = ({ openLogin }) => { // Destructure props object to access openLogin function
    const [formdata, setformdata] = React.useState({
        fullname:"",
        email:"" , 
        password :"",

    })

    function handlechange(event){
        const {name, value , type } = event.target
        setformdata(prevformdata =>{
            if(fullname === 0){
                alert("Name is left blank ")
            }
            else if(email === 0){
                alert("email is left blank ")
            }
            else if(password === 0){
                alert("password is left blank ")
            }
            else{
                alert("all fields are empty")
            }
            return{
                ...prevformdata,
                [name]: value,

            }
        })
    }    
    function handlesubmit(event){
        event.preventDefault()
        console.log(formdata)
    }
    
    return (
        <div>
            <h1>Sign Up</h1>
            <form action="">
                <input type="text" placeholder="Full name" name="fullname"
                onChange={handlechange}
                value={formdata.fullname} />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button>Sign Up</button>
            </form>
            <p>Already have an account?
                <br />
                <a href="#" onClick={openLogin}>Log In</a></p>
        </div>
    );
}

export default Signup;
