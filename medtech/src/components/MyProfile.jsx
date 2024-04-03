import React, { useEffect, useState } from "react";
import $ from "jquery";

const MyProfile = () => {
    const [userData, setUserData] = useState(null);
    const [updatedHistory, setUpdatedHistory] = useState("");
    const [updatedAllergies, setUpdatedAllergies] = useState("");
    const [message, setMessage] = useState("");
    const storedEmail = localStorage.email; 
    const email = storedEmail ? storedEmail.replace(/"/g, "") : ""; 

    useEffect(() => {
        if (email) {
            fetchUserData();
        }
    }, [email]); 

    const fetchUserData = () => {
        $.ajax({
            type: "POST",
            url: "http://localhost:8000/getUserProfile.php",
            data: { email: email },
            success: function(data) {
                setUserData(data);
                setUpdatedHistory(data.history || "");
                setUpdatedAllergies(data.allergies || "");
            },
            error: function(error) {
                console.error("Error fetching user data:", error);
            },
        });
    };

    const handleUpdateUserData = () => {
        // Send AJAX request to update history and allergies in the database
        $.ajax({
            type: "POST",
            url: "http://localhost:8000/updateUserData.php",
            data: {
                email: email,
                history: updatedHistory,
                allergies: updatedAllergies
            },
            success: function(response) {
                setMessage("Updated successfully");
                console.log("User data updated successfully:", response);
                setTimeout(() => setMessage(""), 20000); // Clear message after 20 seconds
                fetchUserData(); // Reload data after successful update
            },
            error: function(error) {
                console.error("Error updating user data:", error);
            },
        });
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().slice(0, 10);
    const currentTimeString = currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

    return (
        <div className="My-Profile">
            <h1>My Profile</h1>
            <div className="profile-info">
            <div>
                <p>{userData.full_name}</p>
                <p>Email: {userData.email}</p>
                <p>Phone: {userData.phone_nb}</p>
                <p>Gender: {userData.gender}</p>
                <p>Date of Birth: {userData.dateofbirth}</p>
            </div>
            <div>

            <h2>Appointments</h2>
            {userData.appointments && userData.appointments.map((appointment, index) => (
                <div key={index}>
                    <p>Date: {appointment.date}</p>
                    <p>Time: {appointment.start_time} - {appointment.end_time}</p>
                    <p>Dr name: {appointment.doctor_name}</p>

                    {(appointment.date === currentDateString && 
                        currentTimeString >= appointment.start_time &&
                        currentTimeString <= appointment.end_time) && (
                            <button onClick={() => handleCallNow(appointment)}>Call Now</button>
                            )}
                </div>
            ))}
            </div>
            <div>
                <h2>Past History</h2>
                <div className="past">
                    <div>
                    <h3>History</h3>
                    {userData.history ? (
                        <div >
                            <ul>
                                {userData.history.split(',').map((item, index) => (
                                    <li key={index}>{item.trim()}</li>
                                ))}
                            </ul>
                            <textarea
                                value={updatedHistory}
                                onChange={(e) => setUpdatedHistory(e.target.value)}
                            />
                            <button onClick={handleUpdateUserData}>Update History</button>
                            {updatedHistory && <span>{message}</span>}
                        </div>
                    ) : (
                        <div>
                            <p>No past history added</p>
                            <textarea
                                value={updatedHistory}
                                onChange={(e) => setUpdatedHistory(e.target.value)}
                            />
                            <button onClick={handleUpdateUserData}>Add History</button>
                            {updatedHistory && <span>{message}</span>}
                        </div>
                    )}
                    </div>
                <div>
                    <h3>Allergies</h3>
                    {userData.allergies ? (
                        <div>
                            <ul>
                                {userData.allergies.split(',').map((item, index) => (
                                    <li key={index}>{item.trim()}</li>
                                ))}
                            </ul>
                            <textarea
                                value={updatedAllergies}
                                onChange={(e) => setUpdatedAllergies(e.target.value)}
                            />
                            <button onClick={handleUpdateUserData}>Update allergies</button>
                            {updatedAllergies && <span>{message}</span>}
                        </div>
                    ) : (
                        <div>
                            <p>No past allergies added</p>
                            <textarea
                                value={updatedAllergies}
                                onChange={(e) => setUpdatedAllergies(e.target.value)}
                            />
                            <button onClick={handleUpdateUserData}>Add allergie</button>
                            {updatedAllergies && <span>{message}</span>}
                        </div>
                    )}
                </div>
                </div>
            </div>
            </div>

            <div className="button-call">
                <button>
                    <a href="call-now">Make an appointment</a>
                </button>
            </div>
            <h2>Diagnosis</h2>
            <div className="diagnosis">

                {userData.diagnosis && userData.diagnosis.map((diagnosis, index) => (
                    <div key={index} className="diagnosis_div">
                        <p>Diagnosis: {diagnosis.diagnosis}</p>
                        <p>Date: {diagnosis.date}</p>
                        {diagnosis.doctor_name && <p>Doctor: {diagnosis.doctor_name}</p>}
                        {diagnosis.image && <img style={{ width: '100px' }} src={`data:image/png;base64,${diagnosis.image}`} alt="Diagnosis" />}
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default MyProfile;
