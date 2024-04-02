<?php
header("Access-Control-Allow-Origin: *");

include_once("config.php"); 

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST["full_name"])) {
        $full_name = $_POST["full_name"];

        $stmt = $conn->prepare("SELECT id FROM doctors WHERE full_name = ?");
        $stmt->bind_param("s", $full_name);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $dr_id = $row['id'];
        $stmt->close();

        $sql = "DELETE FROM appointment WHERE dr_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $dr_id);
        $stmt->execute();
        $stmt->close();

        $sql = "DELETE FROM diagnosis WHERE dr_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $dr_id);
        $stmt->execute();
        $stmt->close();

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

$conn->close();
?>
