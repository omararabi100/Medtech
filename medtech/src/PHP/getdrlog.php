<?php
include_once("config.php");

header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json');

if (isset($_POST['full_name']) && isset($_POST['id'])) {
    $full_name = $_POST['full_name'];
    $id = $_POST['id'];

    if (!empty($full_name) && !empty($id)) {
        $stmt = $conn->prepare("SELECT * FROM doctors WHERE full_name = ?");
        $stmt->bind_param("s", $full_name); 
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            $doctor_id = $row['id']; 
            $first_digit_phone = substr($row['phone_nb'], 0, 1); 

            // Generate the password with doctor ID and first digit of phone number
            $password = str_pad($doctor_id . $first_digit_phone, 4, "0", STR_PAD_RIGHT);
            
            if ($id == $password) {
                echo json_encode(array("success" => true, "data" => $row , 'type'=>'Doctor')); 
            } else {
                echo json_encode(array("error" => "Invalid password")); 
            }
        } else {
            echo json_encode(array("error" => "Invalid full name")); 
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
