<?php
// Allow requests from localhost:5173
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');


require("config.php");

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $email = $_POST["email"];
    $password = $_POST["password"];
    $fullname = $_POST["fullname"];
    $phone_nb = $_POST["phone_nb"];

    // Debugging: Log received data
    error_log("Received data: email=$email, password=$password, fullname=$fullname, phone_nb=$phone_nb");

    // Check if the email already exists in the database
    $sql = "SELECT * FROM users WHERE email = '$email'";
    error_log("SQL query: $sql");
    $result_email = $conn->query($sql);
    error_log("SQL query result: " . print_r($result_email, true)); // Check the result of the query execution

    if ($result_email) {
        if ($result_email->num_rows > 0) {
            // Email already exists
            http_response_code(400); // Bad Request
            echo json_encode(["error" => "Email already exists"]);
            exit;
        } else {
            // Insert the new user into the database
            $hashed_password = password_hash($password, PASSWORD_DEFAULT); // Hash the password
            $insert_sql = "INSERT INTO users (full_name, email, password, phone_nb) VALUES ('$fullname', '$email', '$hashed_password', '$phone_nb')";
            error_log("Insert SQL query: $insert_sql");
            if ($conn->query($insert_sql) === TRUE) {
                // User successfully inserted
                http_response_code(201); // Created
                echo json_encode(["message" => "User created successfully"]);
                exit;
            } else {
                // Error inserting user
                http_response_code(500); // Internal Server Error
                echo json_encode(["error" => "Error creating user: " . $conn->error]);
                exit;
            }
        }
    } else {
        // Error executing the query
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "Error executing query: " . $conn->error]);
        exit;
    }
}

// Invalid request method
http_response_code(405); // Method Not Allowed
echo json_encode(["error" => "Method Not Allowed"]);
?>
