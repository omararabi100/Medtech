<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json');
include_once("config.php");

$email = $_POST['email'];

$sql_user = "SELECT * FROM users WHERE email = ?";
$stmt_user = $conn->prepare($sql_user);
$stmt_user->bind_param("s", $email);
$stmt_user->execute();
$result_user = $stmt_user->get_result();

if ($result_user->num_rows > 0) {
    
    $row_user = $result_user->fetch_assoc();
    $userData = array(
        'id' => $row_user['id'], 
        'full_name' => $row_user['full_name'],
        'email' => $row_user['email'],
        'phone_nb' => $row_user['phone_nb'],
        'gender' => $row_user['gender'],
        'dateofbirth' => $row_user['dateofbirth'],
        'history' => $row_user['history'], 
        'allergies' => $row_user['allergies'], 
        'rating' => $row_user['rating'],
    );

    $sql_appointment = "SELECT a.*, d.full_name AS doctor_name FROM appointment a
                        INNER JOIN doctors d ON a.dr_id = d.id
                        WHERE a.patient_id = ?";
    $stmt_appointment = $conn->prepare($sql_appointment);
    $stmt_appointment->bind_param("i", $userData['id']); 
    $stmt_appointment->execute();
    $result_appointment = $stmt_appointment->get_result();

    $appointmentsData = array();
    while ($row_appointment = $result_appointment->fetch_assoc()) {
        $appointmentsData[] = array(
            'date' => $row_appointment['date'],
            'start_time' => $row_appointment['start_time'],
            'end_time' => $row_appointment['end_time'],
            'doctor_name' => $row_appointment['doctor_name'], 
        );
    }
    $sql_diagnosis = "SELECT di.*, d.full_name AS doctor_name
    FROM diagnosis di 
    LEFT JOIN doctors d ON di.dr_id = d.id
    WHERE di.patient_id = ?";
                        
$stmt_diagnosis = $conn->prepare($sql_diagnosis);
$stmt_diagnosis->bind_param("i", $userData['id']); 
$stmt_diagnosis->execute();
$result_diagnosis = $stmt_diagnosis->get_result();

$diagnosisData = array();
while ($row_diagnosis = $result_diagnosis->fetch_assoc()) {
    $diagnosisData[] = array(
        'image' => $row_diagnosis['image'],
        'date' => $row_diagnosis['date'],
        'diagnosis' => $row_diagnosis['diagnosis'],
        'doctor_name' => $row_diagnosis['doctor_name'], 
    );
}


    $userData['appointments'] = $appointmentsData;
    $userData['diagnosis'] = $diagnosisData;

    echo json_encode($userData);
} else {
    echo json_encode(array('error' => 'User not found'));
}

$stmt_user->close();
$stmt_appointment->close();
$conn->close();
?>
