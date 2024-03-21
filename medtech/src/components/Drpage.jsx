import React, { useEffect, useState } from "react";
import $ from "jquery"; 

const Drpage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        $.ajax({
            type: "GET",
            url: "http://localhost:8000/getUsers.php", 
            success: function(data) {
                setUsers(data.users); 
            },
            error: function(error) {
                console.error("Error fetching users:", error);
            },
        });
    };

    return (
        <div className="">
            <h1>User List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>History</th>
                        <th>Allergies</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.full_name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone_nb}</td>
                            <td>{user.diagnosis && user.diagnosis.history}</td>
                            <td>{user.diagnosis && user.diagnosis.allergies}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Drpage;
