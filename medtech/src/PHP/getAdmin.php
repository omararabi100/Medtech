<?php
include_once("config.php");

header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json');

$stmt = $conn->prepare("SELECT * FROM users WHERE email LIKE ? LIMIT 1");
$stmt->bind_param("s", $emailPattern);
$emailPattern = "%@admin.com";
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    echo json_encode($row);
} else {
    echo json_encode(array()); 
}

$stmt->close();
$conn->close();
?>
