<?php
include_once("config.php");

header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json');

$result = $conn->query("SELECT * FROM doctors");

if ($result->num_rows > 0) {
    
    $doctors = array();

    while ($row = $result->fetch_assoc()) {
        $times = unserialize($row["times"]);
        
        $formattedDateAvailable = implode(", ", str_split($row["date_available"]));
 $dateAvailableArray = explode(",", $row["date_available"]);
 $dateFormatted = implode(", ", $dateAvailableArray);
        
        $doctor = array(
            "id" => $row["id"],
            "full_name" => $row["full_name"],
            "image" => $row["image"],
            "times" =>$times,
            "date_available" => $dateFormatted,
            "phone_nb" => $row["phone_nb"],
            "starting_date" => $row["starting_date"]
        );
    
        
        $doctors[] = $doctor;
    }

    echo json_encode($doctors);
} else {
    echo json_encode(array()); 
}

$conn->close();
?>