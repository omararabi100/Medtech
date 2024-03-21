<?php
include_once("config.php");

// Allow requests from http://localhost:5173
header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json');

// Prepare and execute the SQL query to select one user with an email ending with "@admin.com"
$stmt = $conn->prepare("SELECT * FROM users WHERE email LIKE ? LIMIT 1");
$stmt->bind_param("s", $emailPattern);
$emailPattern = "%@admin.com";
$stmt->execute();
$result = $stmt->get_result();

// Check if there are rows returned
if ($result->num_rows > 0) {
    // Fetch the first row (as there should be only one result due to LIMIT 1)
    $row = $result->fetch_assoc();

    // Encode the user information as JSON and output
    echo json_encode($row);
} else {
    echo json_encode(array()); // Output an empty JSON array if no records found
}

// Close the prepared statement and the database connection
$stmt->close();
$conn->close();
?>
