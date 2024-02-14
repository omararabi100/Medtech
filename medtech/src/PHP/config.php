<?php
$servername = "localhost";
$username = "root";
$password = "0000";
$db_name = "medtech";

// Attempt to create a MySQLi connection
$conn = @new mysqli($servername, $username, $password);

$conn->report_mode = true;

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS $db_name";

// Connect to the database
$conn = @new mysqli($servername, $username, $password, $db_name);

// Create users table
$sql_users = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
    phone_nb  CHAR(10) NOT NULL
)";

// Insert admin user
$adminPassword = password_hash("admin", PASSWORD_DEFAULT);

// Insert the admin user into the database
$sql_insert_admin = "INSERT INTO users (full_name, email, password, phone_nb) VALUES ('Admin', 'admin@admin.com', '$adminPassword', 78905441)";

// Drop the first doctors table if it exists
// $sql_drop_doctors = "DROP TABLE IF EXISTS doctors";

// Create the second doctors table
$sql_create_doctors = "CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    starting_time VARCHAR(100),
    ending_time VARCHAR(100),
    date_available VARCHAR(50) NOT NULL,
    phone_nb CHAR(10) NOT NULL,
    starting_date DATE NOT NULL

)";

// Execute queries
// $conn->query($sql_create_db);
// $conn->query($sql_drop_doctors);

// if ($conn->query($sql_create_doctors) === TRUE) {
//     echo "Table 'doctors' created successfully";
// } else {
//     echo "Error creating table: " . $conn->error;
// }

// Close the connection
// $conn->close();


?>
