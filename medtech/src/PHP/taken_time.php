<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
include_once("config.php");

// Sanitize input
$doctor_id = isset($_GET['doctorId']) ? intval($_GET['doctorId']) : null;
if ($doctor_id === null) {
    http_response_code(400); // Bad Request
    echo json_encode(array("error" => "Doctor ID is missing or invalid."));
    exit();
}

// Fetch appointments for the given doctor ID
$select_sql = "SELECT * FROM appointment WHERE dr_id = ?";
$select_stmt = $conn->prepare($select_sql);
$select_stmt->bind_param("i", $doctor_id);
if (!$select_stmt->execute()) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("error" => "Failed to execute database query."));
    exit();
}

$result = $select_stmt->get_result();

$appointments = array();
while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

// Close prepared statement
$select_stmt->close();

// Prepare response data
$response = array();

// Loop through the appointments and check if the time slot is taken
foreach ($appointments as $appointment) {
    $start_time = $appointment['start_time'];
    $end_time = $appointment['end_time'];
    $date = $appointment['date'];

    // Format the start and end time
    $start = date('Y-m-d H:i:s', strtotime("$date $start_time"));
    $end = date('Y-m-d H:i:s', strtotime("$date $end_time"));
    
    // Add the time slot to the response as taken
    $response[] = array(
        'date' => $date , 
        'start' => $start,
        'end' => $end
    );
}

echo json_encode($response);
?>
