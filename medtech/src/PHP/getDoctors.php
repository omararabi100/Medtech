<?php
include_once("config.php");

// Allow requests from http://localhost:5173
header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json');

// Fetch data from the database
$result = $conn->query("SELECT * FROM doctors");

// Check if there are rows returned
if ($result->num_rows > 0) {
    // Initialize an empty array to store doctor records
    $doctors = array();

    // Loop through each row and append to the doctors array
    while ($row = $result->fetch_assoc()) {
        // Split the date_available string into individual words
        $dates = explode(", ", $row["date_available"]);

        // Format the date_available field with each word on a separate line
        $formatted_dates = implode("\n", $dates);

        // Create a new array for each doctor record including the formatted fields
        $doctor = array(
            "id" => $row["id"],
            "full_name" => $row["full_name"],
            "starting_time" => $row["starting_time"],
            "ending_time" => $row["ending_time"],
            "date_available" => $formatted_dates, // Use formatted_dates
            "phone_nb" => $row["phone_nb"],
            "starting_date" => $row["starting_date"]
        );

        // Append the doctor record to the doctors array
        $doctors[] = $doctor;
    }

    // Encode the array as JSON and output
    echo json_encode($doctors);
} else {
    echo json_encode(array()); // Output an empty JSON array if no records found
}

// Close the database connection
$conn->close();
?>
