<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once("config.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $doctorId = $_POST['doctorId'];
    $formattedDate = $_POST['formattedDate'];
    $formattedStartTime = $_POST['formattedStartTime'];
    $formattedEndTime = $_POST['formattedEndTime'];
    $patientId = isset($_POST['patient_id']) ? $_POST['patient_id'] : null;

    if ($patientId !== null) {
        $query = "SELECT a.*, u.*, d.full_name AS doctor_name
                    FROM appointment a 
                    INNER JOIN users u ON a.patient_id = u.id 
                    LEFT JOIN diagnosis di ON u.id = di.patient_id 
                    LEFT JOIN doctors d ON di.dr_id = d.id
                    WHERE a.patient_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $patientId);
    } else {
        $query = "SELECT a.*, u.*, d.full_name AS doctor_name
                    FROM appointment a 
                    INNER JOIN users u ON a.patient_id = u.id 
                    LEFT JOIN diagnosis di ON u.id = di.patient_id 
                    LEFT JOIN doctors d ON di.dr_id = d.id
                    WHERE a.date = ? AND a.start_time = ? AND a.end_time = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sss", $formattedDate, $formattedStartTime, $formattedEndTime);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $patientInfo = $result->fetch_assoc();

    $diagnosisQuery = "SELECT di.*, d.full_name AS doctor_name, di.image
    FROM diagnosis di 
    LEFT JOIN doctors d ON di.dr_id = d.id
    WHERE di.patient_id = ?";

    
    $diagnosisStmt = $conn->prepare($diagnosisQuery);
    $diagnosisStmt->bind_param("i", $patientInfo['id']);
    $diagnosisStmt->execute();
    $diagnosisResult = $diagnosisStmt->get_result();

    // Fetch diagnosis information
    $diagnosisInfo = [];
    while ($row = $diagnosisResult->fetch_assoc()) {
        $row['image'] = $row['image']; 
        $diagnosisInfo[] = $row;
    }

    $stmt->close();
    $diagnosisStmt->close();

    $combinedInfo = [
        "patient_info" => $patientInfo,
        "diagnosis" => $diagnosisInfo
    ];

    header('Content-Type: application/json');
    echo json_encode($combinedInfo);
} else {
    http_response_code(405); 
    echo json_encode(["error" => "Method Not Allowed"]);
}

?>
