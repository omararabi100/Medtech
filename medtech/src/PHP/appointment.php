<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");

include_once("config.php");

$patient_email = str_replace('"', '', $_POST['patient_email']);
$dr_id = $_POST['dr_id'];
$date = $_POST['date'];
$start_time = $_POST['start_time']; 
$end_time = $_POST['end_time']; 


$select_sql = "SELECT id FROM users WHERE email = ?";
$select_stmt = $conn->prepare($select_sql);
$select_stmt->bind_param("s", $patient_email);
$select_stmt->execute();
$select_result = $select_stmt->get_result();

if ($select_result->num_rows > 0) {
    $row = $select_result->fetch_assoc();
    $patient_id = $row['id'];

    $insert_sql = "INSERT INTO appointment (patient_id, dr_id, date, start_time, end_time) VALUES (?, ?, ?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_sql);
    $insert_stmt->bind_param("iisss", $patient_id, $dr_id, $date, $start_time, $end_time);

    if ($insert_stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "Appointment reserved successfully."));
    } else {
        echo json_encode(array("success" => false, "message" => "Error reserving appointment."));
        error_log("Error inserting appointment into database: " . $insert_stmt->error);
    }

    $insert_stmt->close();
} else {
    echo json_encode(array("success" => false, "message" => "No user found with the provided email."));
    error_log("No user found with email: " . $patient_email);
}

$select_stmt->close();
$conn->close();
?>
