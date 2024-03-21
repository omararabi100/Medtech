<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");

// Include your database connection file
include_once("config.php");

// Check if form is submitted via POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Extract data from POST request
    $full_name = $_POST['full_name'] ?? '';
    $phone_nb = $_POST['phone_nb'] ?? '';
    $starting_date = $_POST['starting_date'] ?? '';
    $date_available = $_POST['date_available'] ?? '';
    $time = json_decode($_POST['time'], true); // Decode JSON string to array

    // Check if $time is an array
    if (!is_array($time)) {
        echo json_encode(["error" => "Invalid time slots data"]);
        exit;
    }

    // Process image upload
    $imageData = null; // Default value for image
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        // Read the file contents and encode it as base64
        $imageData = base64_encode(file_get_contents($_FILES['image']['tmp_name']));
    }

    if (!empty($time)) {
        // Check if the full name already exists in the database
        $checkQuery = "SELECT full_name FROM doctors WHERE full_name = ?";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bind_param("s", $full_name);
        $checkStmt->execute();
        $checkStmt->store_result();
        if ($checkStmt->num_rows > 0) {
            // Name already exists, return error message
            echo json_encode(["error" => "Name already exists"]);
            exit;
        }
        $checkStmt->close();

        // Serialize the time slots array
        $serializedTimes = serializeTimeSlots($time);
    
        // Continue with your database insertion code
    } else {
        echo json_encode(["error" => "Time slots array is empty"]);
    }
    // Check connection
    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
    }
    // Prepare SQL statement to insert data
    $sql = "INSERT INTO doctors (full_name, image, times, date_available, phone_nb, starting_date) VALUES (?, ?, ?, ?, ?, ?)";

    // Prepare and bind parameters
    $stmt = $conn->prepare($sql);
    // Bind parameters
    $stmt->bind_param("ssssss", $full_name, $imageData, $serializedTimes, $date_available, $phone_nb, $starting_date);

    // Execute SQL statement
    if ($stmt->execute() === TRUE) {
        echo json_encode(["success" => "New record created successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
} else {
    // Handle the case when the request method is not POST
    echo json_encode(["error" => "Invalid request method"]);
}

function serializeTimeSlots($timeSlots) {
    $serialized = [];
    foreach ($timeSlots as $dayIndex => $daySlot) {
        $day = $daySlot['day'];
        $slots = [];
        foreach ($daySlot['slots'] as $slotIndex => $slot) {
            $starting_time = $slot['starting_time'];
            $ending_time = $slot['ending_time'];
            $slots[] = ["starting_time" => $starting_time, "ending_time" => $ending_time];
        }
        $serialized[] = ["day" => $day, "slots" => $slots];
    }
    return serialize($serialized);
}

?>
