<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json');
include_once('config.php');

$sql_users = "SELECT u.*, d.full_name AS doctor_name FROM users u
                JOIN doctors d ON u.registered_dr = d.full_name"; 

$result_users = $conn->query($sql_users);

if ($result_users) {
    $users = array();
    while ($row = $result_users->fetch_assoc()) {
        $users[] = $row;
    }
} else {
    $users = [];
}


$response = array(
    "users" => $users
);

echo json_encode($response);
?>
