<?php
$servername = "localhost";
$username = "root";
$password = "0000";
$db_name = "medtech";

// Attempt to create a MySQLi connection
$conn = new mysqli($servername, $username, $password);

$conn->report_mode = true;

// Create database if it doesn't exist
$sql_create_db = "CREATE DATABASE IF NOT EXISTS $db_name";
$conn->query($sql_create_db);

// Connect to the database
$conn = new mysqli($servername, $username, $password, $db_name);

// Create users table if it doesn't exist
$sql_create_users = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
    phone_nb CHAR(10) NOT NULL
)";
$conn->query($sql_create_users);

// Hash the password for the admin user
$admin_password = "admin";
$hashed_admin_password = password_hash($admin_password, PASSWORD_DEFAULT);

// Insert admin user
$admin_full_name = "Admin";
$admin_email = "admin@admin.com";
$admin_phone_nb = "78905441";

// Check if the admin user already exists
$sql_check_admin = "SELECT 1 FROM users WHERE email = '$admin_email' LIMIT 1";
$result_check_admin = $conn->query($sql_check_admin);

if (!$result_check_admin || $result_check_admin->num_rows === 0) {
    // Admin user doesn't exist, insert it
    $sql_insert_admin = "INSERT INTO users (full_name, email, password, phone_nb) VALUES ('$admin_full_name', '$admin_email', '$hashed_admin_password', '$admin_phone_nb')";
}

// Close the connection
$conn->close();
?>
