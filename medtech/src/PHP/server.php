<?php
// Allow requests from localhost:5173
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST'); // Allow only POST requests
header('Access-Control-Allow-Headers: Content-Type'); // Allow Content-Type header
header('Content-Type: application/json'); // Set response content type to JSON

require("config.php");

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    // Sanitize inputs to prevent SQL injection
    $email = mysqli_real_escape_string($conn, $email);

    // Query to retrieve user data by email
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // User exists, verify password
        $user = $result->fetch_assoc();
        if (password_verify($password, $user["password"])) {
            // Password is correct, return user's name
            echo json_encode(["name" => $user["full_name"]]);
            exit;
        } else {
            // Password is incorrect
            http_response_code(401); // Unauthorized
            echo json_encode(["error" => "Invalid password"]);
            exit;
        }
    } else {
        // Email not found in the database
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Invalid email"]);
        exit;
    }
}

?>
