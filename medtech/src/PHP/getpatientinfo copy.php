<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once("config.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $dr_id = $_POST['doctorId'];
    $date = $_POST['formattedDate'];
    $startTime = $_POST['formattedStartTime'];
    $endTime = $_POST['formattedEndTime'];

    $query = "SELECT a.*, u.*, d.full_name 
                FROM appointment a 
                INNER JOIN users u ON a.patient_id = u.id 
                LEFT JOIN diagnosis di ON u.id = di.patient_id 
                LEFT JOIN doctors d ON di.dr_id = d.id
                WHERE a.date = ? AND a.start_time = ? AND a.end_time = ?";
    $stmt = $conn->prepare($query);

    $stmt->bind_param("sss", $date, $startTime, $endTime);

    $stmt->execute();

    $result = $stmt->get_result();

    $patientInfo = $result->fetch_assoc();

    $diagnosisQuery = "SELECT di.*, d.full_name 
                        FROM diagnosis di 
                        LEFT JOIN doctors d ON di.dr_id = d.id
                        WHERE di.patient_id = ?";
    $diagnosisStmt = $conn->prepare($diagnosisQuery);
    $diagnosisStmt->bind_param("i", $patientInfo['patient_id']);
    $diagnosisStmt->execute();
    $diagnosisResult = $diagnosisStmt->get_result();
    
    $diagnosisInfo = array();
    while ($row = $diagnosisResult->fetch_assoc()) {
        $diagnosisInfo[] = $row;
    }
    
    $stmt->close();
    $diagnosisStmt->close();
    
    
    $combinedInfo = array(
        "patient_info" => $patientInfo,
        "diagnosis" => $diagnosisInfo
    );
    
    header('Content-Type: application/json');
    echo json_encode($combinedInfo);
    
} else {
    http_response_code(405); 
    echo json_encode(["error" => "Method Not Allowed"]);
}

?>
