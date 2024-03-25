<?php
include_once("config.php");

header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json');

$email = $_POST['email'];
$updatedHistory = $_POST['history'];
$updatedAllergies = $_POST['allergies'];

$sql_update = "UPDATE users SET history = ?, allergies = ? WHERE email = ?";
$stmt_update = $conn->prepare($sql_update);
$stmt_update->bind_param("sss", $updatedHistory, $updatedAllergies, $email);

$response = array();

if ($stmt_update->execute()) {
    $response['success'] = true;
    $response['message'] = "User data updated successfully.";
} else {
    $response['success'] = false;
    $response['message'] = "Error updating user data.";
}

echo json_encode($response);

$stmt_update->close();
$conn->close();
?>
