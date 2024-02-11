import React, { useState, useEffect } from "react";
import $ from "jquery";

const Admin = () => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({
        full_name: "",
        time_slot: "",
        date_available: "",
        phone_nb: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    // Function to fetch data from the server
    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = () => {
        $.ajax({
            url: "http://localhost:8000/getDoctors.php",
            type: "GET",
            dataType: "json",
            success: (response) => {
                console.log("Fetched data:", response);
                setData(response);
            },
            error: (error) => {
                console.error("Error fetching data:", error);
            }
        });
    };

    const deleteDoctor = (full_name) => {
        $.ajax({
            url: "http://localhost:8000/deleteDoctor.php",
            type: "POST",
            data: { full_name },
            success: (response) => {
                console.log("Response from server:", response);
                fetchData();
            },
            error: (error) => {
                console.error("Error deleting doctor:", error);
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const addDoctor = (event) => {
        event.preventDefault();
        
        // Check if any field is empty
        if (Object.values(formData).some(value => value === "")) {
            setErrorMessage("All fields should be filled");
            return;
        }

        $.ajax({
            url: "http://localhost:8000/addDoctor.php",
            type: "POST",
            data: formData,
            success: (response) => {
                console.log("Doctor added successfully", response);
                fetchData();
                // Clear the form after successful addition
                setFormData({
                    full_name: "",
                    time_slot: "",
                    date_available: "",
                    phone_nb: ""
                });
                setErrorMessage(""); // Clear any previous error message
            },
            error: (error) => {
                console.error("Error adding doctor:", error);
            }
        });
    };

    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="admin-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Time Slot</th>
                        <th>Date Available</th>
                        <th>Phone Number</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((doctor) => (
                        <tr key={doctor.id}>
                            <td>{doctor.id}</td>
                            <td>{doctor.full_name}</td>
                            <td>{doctor.time_slot}</td>
                            <td>{doctor.date_available}</td>
                            <td>{doctor.phone_nb}</td>
                            <td>
                            <button onClick={() => deleteDoctor(doctor.full_name)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="25" width="25">
                                    <path fill="#6361D9" d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                    </svg>
                                    </button>
                                {/* <button onClick={() => deleteDoctor(doctor.full_name)}>Delete</button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <form>
                <input type="text" placeholder="Full name" name="full_name" value={formData.full_name} onChange={handleInputChange} />
                <input type="text" placeholder="Time slot weekdays" name="time_slot" value={formData.time_slot} onChange={handleInputChange} />
                <input type="date" placeholder="Date" name="date_available" min={getCurrentDate()} value={formData.date_available} onChange={handleInputChange} />
                <input type="tel" placeholder="Phone number" name="phone_nb" value={formData.phone_nb} onChange={handleInputChange} />
                <button type="submit" onClick={addDoctor}>Add</button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </form>

        </div>
    );
};

export default Admin;
