<?php
// Allow requests from localhost:5173
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');


require("config.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $email = $_POST["email"];
    $password = $_POST["password"];
    $fullname = $_POST["full_name"];
    $phone_nb = $_POST["phone_nb"];
    $gender = $_POST["gender"];
    $dateofbirth = $_POST["dateofbirth"];

    

    $sql = "SELECT * FROM users WHERE email = '$email'";
    error_log("SQL query: $sql");
    $result_email = $conn->query($sql);
    error_log("SQL query result: " . print_r($result_email, true));

    if ($result_email) {
        if ($result_email->num_rows > 0) {
            http_response_code(400);
            echo json_encode(["error" => "Email already exists"]);
            exit;
        } else {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $insert_sql = "INSERT INTO users (full_name, email, password, phone_nb, gender, dateofbirth) 
            VALUES ('$fullname', '$email', '$hashed_password', '$phone_nb', '$gender', '$dateofbirth')";            error_log("Insert SQL query: $insert_sql");
            if ($conn->query($insert_sql) === TRUE) {
                http_response_code(201); 
                echo json_encode(["message" => "User created successfully", "full_name" => $fullname]);

                exit;
            } else {
                http_response_code(500); 
                echo json_encode(["error" => "Error creating user: " . $conn->error]);
                exit;
            }
        }
    } else {
        http_response_code(500); 
        echo json_encode(["error" => "Error executing query: " . $conn->error]);
        exit;
    }
}

http_response_code(405);
echo json_encode(["error" => "Method Not Allowed"]);
?>
