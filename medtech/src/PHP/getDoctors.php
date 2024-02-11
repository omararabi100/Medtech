<?php
// Include the database configuration
require("config.php");
header("Access-Control-Allow-Origin: *");

// Fetch data from the database
$result = $conn->query("SELECT * FROM doctors");

// Check if there are rows returned
if ($result->num_rows > 0) {
    // Initialize an empty array to store doctor records
    $doctors = array();

    // Loop through each row and append to the doctors array
    while ($row = $result->fetch_assoc()) {
        $doctors[] = $row;
    }

    // Encode the array as JSON and output
    echo json_encode($doctors);
} else {
    echo json_encode(array()); // Output an empty JSON array if no records found
}

// Close the database connection
$conn->close();
?>
