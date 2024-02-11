<?php
include_once("config.php");

// Allow requests from http://localhost:5173
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Origin: *");

// Validate input data
$full_name = isset($_POST["full_name"]) ? $_POST["full_name"] : "";
$time_slot = isset($_POST["time_slot"]) ? $_POST["time_slot"] : "";
$date_available = isset($_POST["date_available"]) ? $_POST["date_available"] : "";
$phone_nb = isset($_POST["phone_nb"]) ? $_POST["phone_nb"] : "";

// Check if required fields are empty
if (empty($full_name) || empty($time_slot) || empty($date_available) || empty($phone_nb)) {
    http_response_code(400); // Bad Request
    echo json_encode(array("error" => "All fields are required."));
    exit;
}

// Prepare and execute the SQL query
$query = "INSERT INTO doctors (full_name, time_slot, date_available, phone_nb) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssss", $full_name, $time_slot, $date_available, $phone_nb);
if ($stmt->execute()) {
    http_response_code(201); // Created
    echo json_encode(array("message" => "Doctor added successfully."));
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Unable to add doctor."));
}

// Close the database connection
$stmt->close();
$conn->close();
?>
