import React from "react";

function Aboutus(){
    return(
        <>
        <div className="About-us-container">
            <h1>Who Are We?</h1>
            <div className="about-us-line"></div>
            <div className="content">
                {/* <img src="public/Aboutus.png" alt="this image is loaded yet"/> */}
                <p>Welcome to our telemedicine and image analysis platform, where cutting-edge technology meets  compassionate dermatological care. At our core, we are dedicated to bridging the gap between dermatologists and patients, ensuring accessible and efficient healthcare services. Our team of experienced dermatologists utilizes state of the art image analysis tools to provide accurate diagnoses and personalized treatment plans, all from the comfort of your own home. Whether you're seeking expert advice on skincare concerns or in need of medical intervention, trust us to deliver high-quality care tailored to your unique needs. Join us in revolutionizing the future of dermatological healthcare, one virtual consultation at a time.</p>
            </div>
        </div>
        </>
    )
}

export default Aboutus;