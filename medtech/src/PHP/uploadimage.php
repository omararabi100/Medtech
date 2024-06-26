<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json');

include_once("config.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['image']) && isset($_POST['email'])) {
        $email = $_POST['email'];
        $diagnosis = $_POST['predicted_class'];
        $imageData = file_get_contents($_FILES['image']['tmp_name']);

        $base64Image = base64_encode($imageData);

        $sql = "SELECT id FROM users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $userId = $row['id'];

            $currentDate = date("Y-m-d H:i:s");

            $sql = "INSERT INTO diagnosis (patient_id,diagnosis, image, date  ) VALUES (?, ?, ? , ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("isss", $userId,$diagnosis, $base64Image, $currentDate );
            
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Image uploaded successfully"]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to upload image"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "User not found"]);
        }
        
        $conn->close();
    } else {
        echo json_encode(["success" => false, "message" => "No image file or email received"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
?>
