<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");

include_once("config.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $full_name = $_POST['full_name'] ?? '';
    $phone_nb = $_POST['phone_nb'] ?? '';
    $starting_date = $_POST['starting_date'] ?? '';
    $date_available = $_POST['date_available'] ?? '';
    $time = json_decode($_POST['time'], true); 

    
    if (!is_array($time)) {
        echo json_encode(["error" => "Invalid time slots data"]);
        exit;
    }

    $imageData = null; 
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $imageData = base64_encode(file_get_contents($_FILES['image']['tmp_name']));
    }
    if (empty($time)) {
        $time = [
            [
                "day" => $date_available,
                "slots" => [
                    ["starting_time" => "08:00", "ending_time" => "17:00"]
                ]
            ]
        ];
    }
    
    if (!empty($time)) {
        $checkQuery = "SELECT full_name FROM doctors WHERE full_name = ?";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bind_param("s", $full_name);
        $checkStmt->execute();
        $checkStmt->store_result();
        if ($checkStmt->num_rows > 0) {
            echo json_encode(["error" => "Name already exists"]);
            exit;
        }
        $checkStmt->close();

        $serializedTimes = serializeTimeSlots($time);
    
    } else {
        echo json_encode(["error" => "Time slots array is empty"]);
    }
    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
    }
    $sql = "INSERT INTO doctors (full_name, image, times, date_available, phone_nb, starting_date) VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssss", $full_name, $imageData, $serializedTimes, $date_available, $phone_nb, $starting_date);

    if ($stmt->execute() === TRUE) {
        echo json_encode(["success" => "New record created successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
}

function serializeTimeSlots($timeSlots) {
    $serialized = [];
    foreach ($timeSlots as $dayIndex => $daySlot) {
        $day = $daySlot['day'];
        $slots = [];
        foreach ($daySlot['slots'] as $slotIndex => $slot) {
            $starting_time = $slot['starting_time'];
            $ending_time = $slot['ending_time'];
            $slots[] = ["starting_time" => $starting_time, "ending_time" => $ending_time];
        }
        $serialized[] = ["day" => $day, "slots" => $slots];
    }
    return serialize($serialized);
}

?>
