<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Content-Type: application/json');

require("config.php");

// Get the number of happy customers (users with rating >= 3)
$sql_happy_customers = "SELECT COUNT(*) as count FROM users WHERE rating >= 3";
$result_happy_customers = $conn->query($sql_happy_customers);
$row_happy_customers = $result_happy_customers->fetch_assoc();
$happy_customers = $row_happy_customers['count'];

// Get the number of monthly visitors (total number of users)
$sql_monthly_visitors = "SELECT COUNT(*) as count FROM users";
$result_monthly_visitors = $conn->query($sql_monthly_visitors);
$row_monthly_visitors = $result_monthly_visitors->fetch_assoc();
$monthly_visitors = $row_monthly_visitors['count'];

// Get the number of doctors
$sql_num_doctors = "SELECT COUNT(*) as count FROM doctors";
$result_num_doctors = $conn->query($sql_num_doctors);
$row_num_doctors = $result_num_doctors->fetch_assoc();
$num_doctors = $row_num_doctors['count'];

// Top partners data (you need to fetch this from your database)

// Construct the statistics array
$statistics = array(
    "happy_customers" => $happy_customers,
    "monthly_visitors" => $monthly_visitors,
    "num_doctors" => $num_doctors,
    "top_partners" => "6" // Replace this with your actual data
);

// Return the statistics as JSON
echo json_encode($statistics);

// Close the connection
$conn->close();
?>
