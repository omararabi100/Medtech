import React, { useEffect, useState } from "react";
import $ from "jquery";

const MyProfile = () => {
    const [userData, setUserData] = useState(null);
    const [updatedHistory, setUpdatedHistory] = useState("");
    const [updatedAllergies, setUpdatedAllergies] = useState("");
    const [message,setmessage] = useState("");
    const storedEmail = localStorage.email; 
    const email = storedEmail ? storedEmail.replace(/"/g, "") : ""; 

    useEffect(() => {
        if (email) {
            fetchUserData();
        }
    }, [email]); // Fetch data whenever email changes

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
                setmessage ("updated successfully");

                console.log("User data updated successfully:", response);
                // Optionally, you can update the local state or display a success message
            },
            error: function(error) {
                console.error("Error updating user data:", error);
            },
        });
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="My-Profile">
            <h1>My Profile</h1>
            {/* Display user information */}
            <p>Name: {userData.full_name}</p>
            <p>Email: {userData.email}</p>
            <p>Phone: {userData.phone_nb}</p>
            <p>Gender: {userData.gender}</p>
            <p>Date of Birth: {userData.dateofbirth}</p>
            <h2>Registration Information</h2>
            {userData.registered_dr ? (
                <div>
                    <p>Registered Doctor: {userData.registered_dr}</p>
                    <p>Registration Time: {userData.registered_time}</p>
                </div>
            ) : (
                <span>No registrations found</span>
            )}
            <h2>Past History</h2>
            {userData.diagnosis && userData.diagnosis.map((diagnosis, index) => (
                <div key={index}>
                    <p>Diagnosis: {diagnosis.diagnosis}</p>
                    <p>Date: {diagnosis.date}</p>
                    {diagnosis.doctor_name && <p>Doctor: {diagnosis.doctor_name}</p>}
                    {diagnosis.image && <img src={`data:image/png;base64,${diagnosis.image}`} alt="Diagnosis" />}
                </div>
            ))}
            <h2>Check out and add your data</h2>
            <div>
            <h3>History</h3>
            <br />

    {userData.history ? (
        <div>
            {/* <p>{userData.history}</p> */}
            <textarea
                value={updatedHistory}
                onChange={(e) => setUpdatedHistory(e.target.value)}
            />
            <button onClick={handleUpdateUserData}>Update History</button>
        </div>
    ) : (
        <div>
            <p>No past history added</p>
            <textarea
                value={updatedHistory}
                onChange={(e) => setUpdatedHistory(e.target.value)}
            />
            <button onClick={handleUpdateUserData}>Add History</button>
        </div>
    )}
            </div>
            <div>
                <h3>Allergies</h3>
                <br />
                {userData.allergies ? (
                    <div>
                        {/* <p>{userData.allergies}</p> */}
                        <textarea
                            value={updatedAllergies}
                            onChange={(e) => setUpdatedallergies(e.target.value)}
                        />
                        <button onClick={handleUpdateUserData}>Update allergies</button>
                    </div>
                ) : (
                    <div>
                        <p>No past allergies added</p>
                        <textarea
                            value={updatedAllergies}
                            onChange={(e) => setUpdatedHistory(e.target.value)}
                        />
                        <button onClick={handleUpdateUserData}>Add allergie</button>
                    </div>
                )}
                {/* <textarea value={updatedAllergies} onChange={(e) => setUpdatedAllergies(e.target.value)} />
                <button onClick={handleUpdateUserData}>Update Allergies</button> */}
            </div>
                <span>{message}</span>
                <br />
            <button>
                <a href="call-now">Make an appointment</a>
            </button>
        </div>
    );
};

export default MyProfile;
