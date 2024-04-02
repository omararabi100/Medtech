import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $ from "jquery"; 

const Drpage = () => {
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = () => {
        $.ajax({
            type: "GET",
            url: "http://localhost:8000/getUsers.php", 
            success: function(data) {
                setPatients(data.users); 
            },
            error: function(error) {
                console.error("Error fetching patients:", error);
            },
        });
    };

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredPatients = patients.filter(patient =>
        patient.full_name.toLowerCase().includes(searchQuery)
    );

    return (
        <div className="">
            <h1>Patient List</h1>
            <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchInputChange}
            />
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Phone</th>
                        <th>History</th>
                        <th>Allergies</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPatients.map((patient, index) => (
                        <tr key={index}>
                            <td>
                                <Link to={`/patient-info/${patient.id}`}>
                                    {patient.id}
                                </Link>
                            </td>
                            <td>{patient.full_name}</td>
                            <td>{patient.email}</td>
                            <td>{patient.gender}</td>
                            <td>{calculateAge(patient.dateofbirth)}</td>
                            <td>{patient.phone_nb}</td>
                            <td>{patient.diagnosis && patient.diagnosis.history ? patient.diagnosis.history : "None"}</td>
                            <td>{patient.diagnosis && patient.diagnosis.allergies ? patient.diagnosis.allergies : "None"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Drpage;
