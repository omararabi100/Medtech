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

// Create doctors table
$sql_doctors = "CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    time_slot VARCHAR(100),
    date_available DATE, 
    phone_nb  CHAR(10) NOT NULL
)";

// Close the connection
// $conn->close();
?>
