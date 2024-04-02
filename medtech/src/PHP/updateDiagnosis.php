<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once("config.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $patientId = $_POST['patientId'];
    $diagnosisText = $_POST['diagnosis'];
    $doctorId = $_POST['doctorId'];

    // Check if the doctor exists in the doctors table
    $checkDoctorQuery = "SELECT full_name FROM doctors WHERE id = ?";
    $checkDoctorStmt = $conn->prepare($checkDoctorQuery);
    $checkDoctorStmt->bind_param("i", $doctorId);
    $checkDoctorStmt->execute();
    $checkDoctorResult = $checkDoctorStmt->get_result();

    if ($checkDoctorResult->num_rows === 0) {
        // If the doctor doesn't exist, prompt the user to provide the full name
        $errorMessage = "Doctor with ID $doctorId does not exist. Please provide the full name.";
        http_response_code(404);
        echo json_encode(array("message" => $errorMessage));
        exit; // Exit the script
    }

    // Fetch the doctor's full name
    $doctor = $checkDoctorResult->fetch_assoc();
    $doctorFullName = $doctor['full_name'];

    // Insert the diagnosis
    $insertDiagnosisQuery = "INSERT INTO diagnosis (patient_id, diagnosis, dr_id, date) VALUES (?, ?,  ?, NOW())";
    $insertDiagnosisStmt = $conn->prepare($insertDiagnosisQuery);
    $insertDiagnosisStmt->bind_param("iss", $patientId, $diagnosisText, $doctorId);
    
    if ($insertDiagnosisStmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Diagnosis updated successfully"));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Failed to update diagnosis"));
    }

    $insertDiagnosisStmt->close();
    $checkDoctorStmt->close();
    $conn->close();
} else {
    // If the request method is not allowed, send a method not allowed response
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed"]);
}

?>
