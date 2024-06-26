import React, { useEffect, useState } from "react";
import $ from "jquery";
import CallButton from "./CallButton";

const MyProfile = () => {
    const [userData, setUserData] = useState(null);
    const [updatedHistory, setUpdatedHistory] = useState("");
    const [updatedAllergies, setUpdatedAllergies] = useState("");
    const [message, setMessage] = useState("");
    const storedEmail = localStorage.email;
    const email = storedEmail ? storedEmail.replace(/"/g, "") : "";
    const [rating, setRating] = useState(0);

    const handleUpdateRating = (newRating) => {
        $.ajax({
            type: "POST",
            url: "http://localhost:8000/updateRating.php",
            data: {
                email: email,
                rating: newRating
            },
            success: function (response) {
                console.log("Rating updated successfully:", response);
                fetchUserData(); // Reload data after successful update
            },
            error: function (error) {
                console.error("Error updating rating:", error);
            },
        });
    };

    const handleStarHover = (starIndex) => {
        setRating(starIndex + 1);
    };

    const handleStarLeave = () => {
        setRating(userData.rating || 0);
    };

    const handleClickStar = () => {
        handleUpdateRating(rating); // Update rating in the database
    };

    useEffect(() => {
        if (email) {
            fetchUserData();
        }
    }, [email]);

    useEffect(() => {
        if (userData && userData.rating !== undefined) {
            setRating(userData.rating || 0); // Set initial rating from userData
        }
    }, [userData]);

    const fetchUserData = () => {
        $.ajax({
            type: "POST",
            url: "http://localhost:8000/getUserProfile.php",
            data: { email: email },
            success: function (data) {
                setUserData(data);
                setUpdatedHistory(data.history || "");
                setUpdatedAllergies(data.allergies || "");

            },
            error: function (error) {
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
            success: function (response) {
                setMessage("Updated successfully");
                console.log("User data updated successfully:", response);
                setTimeout(() => setMessage(""), 20000); // Clear message after 20 seconds
                fetchUserData(); // Reload data after successful update
            },
            error: function (error) {
                console.error("Error updating user data:", error);
            },
        });
    };

    if (!userData) {
        return <div className="loader">
            <div className="custom-loader"></div>
        </div>;
    }

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().slice(0, 10);
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentTimeString = `${currentHours}:${currentMinutes < 10 ? '0' : ''}${currentMinutes}`;
    // console.log(appointment.dr_id)
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

                            {/* {console.log("Appointment time:", appointment.start_time, "-", appointment.end_time)} */}
                            {/* {console.log("Current time:", currentTimeString)} */}
                            {console.log(appointment)}

                            {(appointment.date === currentDateString &&
                                compareTimes(currentTimeString, appointment.start_time) >= 0 &&
                                compareTimes(currentTimeString, appointment.end_time) <= 0) && (
                                    <CallButton doctorId={appointment.dr_id} />
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
                        <div className="allergies">
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
                                    <button onClick={handleUpdateUserData}>Update Allergies</button>
                                    {updatedAllergies && <span>{message}</span>}
                                </div>
                            ) : (
                                <div>
                                    <p>No past allergies added</p>
                                    <textarea
                                        value={updatedAllergies}
                                        onChange={(e) => setUpdatedAllergies(e.target.value)}
                                    />
                                    <button onClick={handleUpdateUserData}>Add Allergies</button>
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


                {userData.diagnosis && userData.diagnosis.length > 0 ? (
                    userData.diagnosis.map((diagnosis, index) => (
                        <div key={index} className="diagnosis_div">
                            <p>Diagnosis: {diagnosis.diagnosis}</p>
                            <p>Date: {diagnosis.date}</p>
                            {diagnosis.doctor_name && <p>Doctor: {diagnosis.doctor_name}</p>}
                            {diagnosis.image && <img style={{ width: '100px' }} src={`data:image/png;base64,${diagnosis.image}`} alt="Diagnosis" />}
                        </div>
                    ))
                ) : (
                    <div>No diagnosis yet</div>
                )}

            </div>
            <h2 className="rate-label">Rate  your experience with us!</h2>
            <div className="rating-container">
                {[...Array(5)].map((_, index) => (
                    <svg
                        key={index}
                        onMouseEnter={() => handleStarHover(index)}
                        onMouseLeave={handleStarLeave}
                        onClick={handleClickStar}
                        viewBox="0 0 24 24"
                        fill={index < rating ? "#363062" : "#999"}
                        width="50px"
                        height="50px"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        <path d="M0 0h24v24H0z" fill="none" />
                    </svg>
                ))}
            </div>
        </div>
    );
};

// Function to compare two times in 24-hour format
const compareTimes = (time1, time2) => {
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);

    if (hours1 < hours2) return -1;
    if (hours1 > hours2) return 1;
    if (minutes1 < minutes2) return -1;
    if (minutes1 > minutes2) return 1;
    return 0;
};

export default MyProfile;
