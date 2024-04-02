<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: POST");

include_once("config.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_POST['id'] ?? '';
    $full_name = $_POST['full_name'] ?? '';
    $phone_nb = $_POST['phone_nb'] ?? '';
    $date_available = $_POST['date_available'] ?? '';
    $time = $_POST['time'] ?? '';
    $starting_date_str = $_POST['starting_date'] ?? '';
    $starting_date = date('Y-m-d', strtotime($starting_date_str));
    $changetime = $_POST['changetime'] ?? '';

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $imageData = base64_encode(file_get_contents($_FILES['image']['tmp_name']));
    } else {
        $imageData = $_POST['image'] ?? '';
    }

    if ($changetime === 'false') {
        $sql = empty($imageData) 
            ? "UPDATE doctors SET full_name=?, date_available=?, phone_nb=?, starting_date=? WHERE id=?" 
            : "UPDATE doctors SET full_name=?, image=?, date_available=?, phone_nb=?, starting_date=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        if (empty($imageData)) {
            $stmt->bind_param("ssssi", $full_name, $date_available, $phone_nb, $starting_date, $id);
        } else {
            $stmt->bind_param("sssssi", $full_name, $imageData, $date_available, $phone_nb, $starting_date, $id);
        }
    } else {
        $timeArray = is_array($time) ? $time : json_decode($time, true);
        $serializedTimes = serialize($timeArray);
        $imageData = '';

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $imageData = base64_encode(file_get_contents($_FILES['image']['tmp_name']));
        }

        if (empty($imageData)) {
            $sql = "UPDATE doctors SET full_name=?, date_available=?, phone_nb=?, times=?, starting_date=? WHERE id=?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssssi", $full_name, $date_available, $phone_nb, $serializedTimes, $starting_date, $id);
        } else {
            $sql = "UPDATE doctors SET full_name=?, image=?, date_available=?, phone_nb=?, times=?, starting_date=? WHERE id=?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssssi", $full_name, $imageData, $date_available, $phone_nb, $serializedTimes, $starting_date, $id);
        }
    }

    if ($stmt->execute() === TRUE) {
        echo json_encode(["success" => "Doctor updated successfully"]);
    } else {
        echo json_encode(["error" => "Error updating doctor: " . $conn->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method"]);
}
?>
