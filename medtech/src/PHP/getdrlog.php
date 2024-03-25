<?php
include_once("config.php");

header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json');

if (isset($_POST['full_name']) && isset($_POST['id'])) {
    $full_name = $_POST['full_name'];
    $id = $_POST['id'];

    if (!empty($full_name) && !empty($id)) {
        $stmt = $conn->prepare("SELECT * FROM doctors WHERE full_name = ? AND id = ?");
        $stmt->bind_param("si", $full_name, $id); 
        $stmt->execute();
        $result = $stmt->get_result();

        $stmtname = $conn->prepare("SELECT * FROM doctors WHERE full_name = ? ");
        $stmtname->bind_param("s", $full_name); 
        $stmtname->execute();

        $resultname = $stmtname->get_result();

        if ($resultname->num_rows < 1){
            echo json_encode(array("error" => "Invalid full name")); 

        }
        elseif ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            echo json_encode(array("success" => true, "data" => $row , 'type'=>'Doctor')); 
        }
        else {
            echo json_encode(array("error" => "Invalid full name and ID"));
        }

        $stmt->close();
    } else {
        echo json_encode(array("error" => "Full name and ID cannot be empty")); 
    }
} else {
    echo json_encode(array("error" => "Missing parameters")); 
}

$conn->close();
?>
