<?php
include_once("config.php");

// Allow requests from http://localhost:5173
header("Access-Control-Allow-Origin: http://localhost:5173");

// Validate input data
$full_name = isset($_POST["full_name"]) ? $_POST["full_name"] : "";
$date_available = isset($_POST["date_available"]) ? json_encode($_POST["date_available"]) : "";
$phone_nb = isset($_POST["phone_nb"]) ? $_POST["phone_nb"] : "";
$starting_time = isset($_POST["starting_time"]) ? $_POST["starting_time"] : "";
$ending_time = isset($_POST["ending_time"]) ? $_POST["ending_time"] : "";
$starting_date = isset($_POST["starting_date"]) ? date('Y-m-d', strtotime($_POST["starting_date"])) : "";
error_log("Received data - Full Name: " . $full_name . ", Date Available: " . $date_available . ", Phone Number: " . $phone_nb . ", Starting Time: " . $starting_time . ", Ending Time: " . $ending_time . ", Starting Date: " . $starting_date);

// Check if required fields are empty
if (empty($full_name) || empty($date_available) || empty($phone_nb) || empty($starting_time) || empty($ending_time) || empty($starting_date)) {
    http_response_code(400); // Bad Request
    echo json_encode(array("error" => "All fields are required."));
    exit;
}

// Prepare and execute the SQL query
$query = "INSERT INTO doctors (full_name, starting_time, ending_time, date_available, phone_nb, starting_date) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);

// Check if the statement preparation succeeded
if (!$stmt) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Failed to prepare statement."));
    exit;
}

$stmt->bind_param("ssssss", $full_name, $starting_time, $ending_time, $date_available, $phone_nb, $starting_date);

// Execute the prepared statement
if ($stmt->execute()) {
    http_response_code(201); // Created
    // Output the added data
    echo json_encode(array(
        // "message" => "Doctor added successfully.",
        "data" => array(
            "full_name" => $full_name,
            "starting_time" => $starting_time,
            "ending_time" => $ending_time,
            "date_available" => $date_available,
            "phone_nb" => $phone_nb,
            "starting_date" => $starting_date
        )
    ));
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Unable to add doctor."));
}

// Close the statement
$stmt->close();
?>
