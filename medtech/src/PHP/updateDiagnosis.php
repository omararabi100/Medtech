<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once("config.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $patientId = $_POST['patientId'];
    $diagnosisText = $_POST['diagnosis'];
    $doctorId = $_POST['doctorId'];

    $query = "INSERT INTO diagnosis (patient_id, diagnosis, dr_id, date) VALUES (?, ?, ?, NOW())";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iss", $patientId, $diagnosisText, $doctorId);
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Diagnosis updated successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Failed to update diagnosis"));
    }

    $stmt->close();
    $conn->close();
} else {
    // If the request method is not allowed, send a method not allowed response
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed"]);
}

?>
