import React, { useEffect } from "react";
import { images } from "../../image";
// import { initSqlJs, initializeDatabase, createDatabase } from "./database"; // Import initSqlJs, initializeDatabase, and createDatabase from database.js
import MedicalService from "./MedicalService";
import ExpertDerm from "./ExpertDerm";
import Footer from "./Footer";
const Home = () => {
    const doctors = [
        {
            name: "Julian Jameson",
            image: images.Julian1,
        },
        {
            name: "Jack Griffins",
            image: images.Julian2,
        },
        {
            name: "Amy Watterson",
            image: images.Julian3,
        },
        {
            name: "Walter White",
            image: images.Julian4,
        }
    ]
    // useEffect(() => {
    //     const initializeDB = async () => {
    //         const db = await initializeDatabase(); // Call the function to initialize the database
    //     };
    //     initializeDB(); // Call the async function
    // }, []);

    return (
        <div className="Main-Container">
            <div className="home-container">
                <div className="featured-description">
                    <div className="titles-div">
                        <h1>Get Quick</h1>
                        <h1><b>Medical Service</b></h1>
                    </div>
                    <p>Empower yourself with knowledge and take control of your skin health. Technology meets care, transforming the traditional approach to dermatological assessments</p>
                    <button className="get-started-btn">Get Started</button>
                </div>
                <div>
                    <img className="home-container-description-img" src={images.Doctor} alt="" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="256" height="466" viewBox="0 0 256 466" fill="none">
                    <path d="M315.324 1.1023C315.324 1.1023 -188.629 86.2613 79.9026 214.582C348.434 342.903 41.3001 465.124 41.3001 465.124" stroke="#CBAF87" stroke-linecap="round" stroke-dasharray="29 29"/>
                </svg>

                <div className="details-div">
                    <div>
                        <h1>15K</h1>
                        <p>Happy Customers</p>
                    </div>
                    <div>
                        <h1>150K</h1>
                        <p>Monthly Visitors</p>
                    </div>
                    <div>
                        <h1>15</h1>
                        <p>Number of Doctors</p>
                    </div>
                    <div>
                        <h1>100+</h1>
                        <p>Top Partners</p>
                    </div>
                </div>
                </div>

            </div>
            <div className="Medical-Service">
                <h1>Our <span>Medical Service</span></h1>
                <div className="Medical-service-section">
                    <MedicalService 
                        img={images.Checkskin}
                        title="Check Your Skin"
                        context="Upload your images for a personalized dermatological assessment"
                        btncontext="Upload Image"
                        width="280px"
                    />
                    <MedicalService 
                        img={images.Freeconsult}
                        title="Get Free Consultaton"
                        context="Get the chance to communicate with a doctor 
                        through an online call"
                        btncontext="Schedule a Call"
                        width=""
                    />
                    <MedicalService 
                        img={images.Knowyour}
                        title="Get to Know Your Skin Better"
                        context="Empower yourself with knowledge and take the first step towards preventing skin cancer"
                        btncontext="Start Assesment"
                        width=""
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="256" height="466" viewBox="0 0 256 466" fill="none">
                    <path d="M315.324 1.1023C315.324 1.1023 -188.629 86.2613 79.9026 214.582C348.434 342.903 41.3001 465.124 41.3001 465.124" stroke="#CBAF87" stroke-linecap="round" stroke-dasharray="29 29"/>
                </svg>
                </div>
            </div>
            <div className="Expert-Dermatologists">
                <h1>Our <span>Expert Dermatologists</span></h1>
                <div className="Derms-container">
                    {doctors.map((doctor, index) => (
                        <ExpertDerm key={index} name={doctor.name} image=   {doctor.image}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home