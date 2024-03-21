<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json');
include_once('config.php');

// Fetch users registered under specific doctors
$sql_users = "SELECT u.*, d.full_name AS doctor_name FROM users u
              JOIN doctors d ON u.registered_dr = d.full_name"; 

$result_users = $conn->query($sql_users);

if ($result_users->num_rows > 0) {
    $users = array();
    while($row = $result_users->fetch_assoc()) {
        $sql_diagnoses = "SELECT d.*, dr.full_name AS doctor_name 
                          FROM diagnosis d
                          JOIN doctors dr ON d.dr_id = dr.id
                          WHERE d.patient_id = " . $row['id'];
        
        $result_diagnoses = $conn->query($sql_diagnoses);
        $diagnoses = array();
        if ($result_diagnoses->num_rows > 0) {
            while($diagnosis = $result_diagnoses->fetch_assoc()) {
                $diagnoses[] = $diagnosis;
            }
        }
        
        // Add diagnoses data to the user row
        $row['diagnoses'] = $diagnoses;
        $users[] = $row;
    }
} else {
    $users = [];
}

// Close database connection
$conn->close();

// Prepare response array
$response = array(
    "users" => $users
);

// Send JSON response
echo json_encode($response);
?>
