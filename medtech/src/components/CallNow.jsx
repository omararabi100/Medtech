import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "../App.css";
import ExpertDerm from "./ExpertDerm";

function CallNow() {
    const [doctors, setDoctors] = useState([]);
    const [isappointmnet, setisappointmnet] = useState(null);
    const navigate = useNavigate();
    // localStorage.setItem("doctor", JSON.stringify(doctors));
  const doctorinfo = localStorage.getItem('doctorinfo');

    const navigateToCalendar = (doctorinfo) => {
        navigate(`calendar`);
    };
    console.log(doctors);
    useEffect(() => {
        fetch("http://localhost:8000/getDoctors.php")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setDoctors(data))
            .catch(error => console.error("Error fetching doctors:", error));
    }, []);



    return (
        <>
            <div className="call-now-main-container">
                <h1>Make An Appointment</h1>
                <p>Get the chance to communicate with a doctor through an online call</p>
            </div>
            <div className="call-now-second-container">
                <h2>Choose Your Dermatologist</h2>
            </div>

            <div className="call-now-main-container">
                <div className="callnow-doctor-list">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="callnow-Doctor">
                            <div className="doctor-image-container">
                                <ExpertDerm
                                    key={doctor.id}
                                    name={doctor.full_name}
                                    isappointment={true}
                                    doctor={doctor}
                                    navigateToCalendar={navigateToCalendar}                       

                                    image={doctor.image.startsWith('./public') 
                                        ? doctor.image 
                                        : `data:image/${doctor.image.endsWith('.jpg') || doctor.image.endsWith('.jpeg') ? 'jpeg' : 'png'};base64,${doctor.image}`
                                    }
                                />
                            
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default CallNow;
