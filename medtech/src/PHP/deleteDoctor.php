<?php
header("Access-Control-Allow-Origin: *");

include_once("config.php"); 

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST["full_name"])) {
        $full_name = $_POST["full_name"];

        $sql = "DELETE FROM doctors WHERE full_name = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $full_name);

        if ($stmt->execute()) {
            echo "Doctor deleted successfully";
        } else {
            echo "Error deleting doctor: " . $conn->error;
        }

        $stmt->close();
    } else {
        echo "full_name parameter is required";
    }
} else {
    echo "Invalid request method";
}

// Close connection
$conn->close();
?>
