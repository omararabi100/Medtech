<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
include_once("config.php");

$doctor_id = isset($_GET['doctorId']) ? intval($_GET['doctorId']) : null;
if ($doctor_id === null) {
    http_response_code(400); 
    echo json_encode(array("error" => "Doctor ID is missing or invalid."));
    exit();
}

$select_sql = "SELECT * FROM appointment WHERE dr_id = ?";
$select_stmt = $conn->prepare($select_sql);
$select_stmt->bind_param("i", $doctor_id);
if (!$select_stmt->execute()) {
    http_response_code(500); 
    echo json_encode(array("error" => "Failed to execute database query."));
    exit();
}

$result = $select_stmt->get_result();

$appointments = array();
while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

$select_stmt->close();

$response = array();

foreach ($appointments as $appointment) {
    $start_time = $appointment['start_time'];
    $end_time = $appointment['end_time'];
    $date = $appointment['date'];

    $start = date('Y-m-d H:i:s', strtotime("$date $start_time"));
    $end = date('Y-m-d H:i:s', strtotime("$date $end_time"));
    
    $response[] = array(
        'date' => $date , 
        'start' => $start,
        'end' => $end
    );
}

echo json_encode($response);
?>
