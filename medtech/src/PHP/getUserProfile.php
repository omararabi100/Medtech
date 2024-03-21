<?php
include_once("config.php");

header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json');

// Get email from POST data
$email = $_POST['email'];

// Prepare and execute SQL query to fetch user data
$sql_user = "SELECT * FROM users WHERE email = ?";
$stmt_user = $conn->prepare($sql_user);
$stmt_user->bind_param("s", $email);
$stmt_user->execute();
$result_user = $stmt_user->get_result();

// Check if a user was found
if ($result_user->num_rows > 0) {
    // Fetch user data
    $row_user = $result_user->fetch_assoc();
    $userData = array(
        'full_name' => $row_user['full_name'],
        'email' => $row_user['email'],
        'phone_nb' => $row_user['phone_nb'],
        'gender' => $row_user['gender'],
        'dateofbirth' => $row_user['dateofbirth'],
        'history' => $row_user['history'], // Include history field
        'allergies' => $row_user['allergies'], // Include allergies field
    );

    // Fetch user's diagnosis data
    $sql_diagnosis = "SELECT * FROM diagnosis WHERE patient_id = ?";
    $stmt_diagnosis = $conn->prepare($sql_diagnosis);
    $stmt_diagnosis->bind_param("i", $row_user['id']);
    $stmt_diagnosis->execute();
    $result_diagnosis = $stmt_diagnosis->get_result();

    // Prepare diagnosis array
    $diagnosisData = array();
    while ($row_diagnosis = $result_diagnosis->fetch_assoc()) {
        $doctor_name = getDoctorName($conn, $row_diagnosis['dr_id']);
        $diagnosisData[] = array(
            'diagnosis' => $row_diagnosis['diagnosis'],
            'date' => $row_diagnosis['date'],
            'image' => base64_encode($row_diagnosis['image']),
            'doctor_name' => $doctor_name,
        );
    }
    
    $userData['diagnosis'] = $diagnosisData;

    echo json_encode($userData);
} else {
    echo json_encode(array('error' => 'User not found'));
}

// Function to get doctor name by dr_id
function getDoctorName($conn, $dr_id) {
    $sql_doctor = "SELECT full_name FROM doctors WHERE id = ?";
    $stmt_doctor = $conn->prepare($sql_doctor);
    $stmt_doctor->bind_param("i", $dr_id);
    $stmt_doctor->execute();
    $result_doctor = $stmt_doctor->get_result();

    if ($result_doctor->num_rows > 0) {
        $row_doctor = $result_doctor->fetch_assoc();
        return $row_doctor['full_name'];
    } else {
        return "Unknown Doctor";
    }
}

// Close connections and statements
$stmt_user->close();
$stmt_diagnosis->close();
$conn->close();
?>
