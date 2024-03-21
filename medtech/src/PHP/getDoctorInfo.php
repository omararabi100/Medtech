<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json');

include_once("config.php");

if (isset($_GET['id'])) {
    $doctorId = $_GET['id'];

    $sql = "SELECT * FROM doctors WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $doctorId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        header('Content-Type: application/json');
        echo json_encode($row);
    } else {
        http_response_code(404); // Not Found status code
        echo json_encode(array("error" => "No data found for the given identifier"));
    }

    $stmt->close();
} else {
    http_response_code(400); // Bad Request status code
    echo json_encode(array("error" => "Doctor ID not provided"));
}

$conn->close();
?>
