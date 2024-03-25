<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST'); 
header('Access-Control-Allow-Headers: Content-Type'); 
header('Content-Type: application/json');

require("config.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $email = mysqli_real_escape_string($conn, $email);

    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user["password"])) {
            echo json_encode(["full_name" => $user["full_name"]]);

            exit;
        } else {
            http_response_code(401); 
            echo json_encode(["error" => "Invalid password"]);
            exit;
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Invalid email"]);
        exit;
    }
}

?>
