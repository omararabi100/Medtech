<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Content-Type: application/json');

require("config.php");

$sql_happy_customers = "SELECT COUNT(*) as count FROM users WHERE rating >= 3";
$result_happy_customers = $conn->query($sql_happy_customers);
$row_happy_customers = $result_happy_customers->fetch_assoc();
$happy_customers = $row_happy_customers['count'];

$sql_monthly_visitors = "SELECT COUNT(*) as count FROM users";
$result_monthly_visitors = $conn->query($sql_monthly_visitors);
$row_monthly_visitors = $result_monthly_visitors->fetch_assoc();
$monthly_visitors = $row_monthly_visitors['count'];

$sql_num_doctors = "SELECT COUNT(*) as count FROM doctors";
$result_num_doctors = $conn->query($sql_num_doctors);
$row_num_doctors = $result_num_doctors->fetch_assoc();
$num_doctors = $row_num_doctors['count'];


$statistics = array(
    "happy_customers" => $happy_customers,
    "monthly_visitors" => $monthly_visitors,
    "num_doctors" => $num_doctors,
    "top_partners" => "6" 
);

echo json_encode($statistics);

$conn->close();
?>
