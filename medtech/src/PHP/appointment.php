<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

include_once("config.php");
include("appPass.php");
$patient_email = str_replace('"', '', $_POST['patient_email']);
$dr_id = $_POST['dr_id'];
$date = $_POST['date'];
$start_time = $_POST['start_time'];
$end_time = $_POST['end_time'];


$select_doctor_sql = "SELECT full_name FROM doctors WHERE id = ?";
$select_doctor_stmt = $conn->prepare($select_doctor_sql);
$select_doctor_stmt->bind_param("i", $dr_id);
$select_doctor_stmt->execute();
$select_doctor_result = $select_doctor_stmt->get_result();

if ($select_doctor_result->num_rows > 0) {
    $doctor_row = $select_doctor_result->fetch_assoc();
    $registered_dr = $doctor_row['full_name'];

    $select_sql = "SELECT id FROM users WHERE email = ?";
    $select_stmt = $conn->prepare($select_sql);
    $select_stmt->bind_param("s", $patient_email);
    $select_stmt->execute();
    $select_result = $select_stmt->get_result();

    if ($select_result->num_rows > 0) {
        $row = $select_result->fetch_assoc();
        $patient_id = $row['id'];

        $insert_sql = "INSERT INTO appointment (patient_id, dr_id, date, start_time, end_time) VALUES (?, ?, ?, ?, ?)";
        $insert_stmt = $conn->prepare($insert_sql);
        $insert_stmt->bind_param("iisss", $patient_id, $dr_id, $date, $start_time, $end_time);

        if ($insert_stmt->execute()) {
            $update_user_sql = "UPDATE users SET registered_dr = ? WHERE id = ?";
            $update_user_stmt = $conn->prepare($update_user_sql);
            $update_user_stmt->bind_param("si", $registered_dr, $patient_id);
            $update_user_stmt->execute();
            
            try {
                $mail = new PHPMailer(true);
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';    
                $mail->SMTPAuth = true;

                $mail->Username = $senderEmail; 
                $mail->Password = $appPassword; 

                $mail->SMTPSecure = 'ssl';
                $mail->Port = 465;

                $mail->setFrom($senderEmail);
                $mail->addAddress($patient_email);

                $mail->Subject = "Reminder for Appointment on $date";

                $mailBody = "
                Dear Patient,\r\n
                This email is to remind you of your upcoming appointment scheduled with Dr. $registered_dr on $date at $start_time.\r\n
                Please ensure you have stable internet connection before your scheduled appointment time to avoid any issues.\r\n
                If you have any questions or need to reschedule, please contact us at medtech364@gmail.com or reply to this email.\r\n
                We look forward to seeing you at your appointment!\r\n
                Sincerely,\r
                Medtech
                ";

                $mail->Body = $mailBody;

                $mail->send();

            } catch (Exception $e) {
                error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
            }

            echo json_encode(array("success" => true, "message" => "Appointment reserved successfully."));
        } else {
            echo json_encode(array("success" => false, "message" => "Error reserving appointment."));
            error_log("Error inserting appointment into database: " . $insert_stmt->error);
        }

        $insert_stmt->close();
    } else {
        echo json_encode(array("success" => false, "message" => "No user found with the provided email."));
        error_log("No user found with email: " . $patient_email);
    }

    $select_stmt->close();
    $select_doctor_stmt->close();
    $conn->close();
} else {
    echo json_encode(array("success" => false, "message" => "Doctor not found with the provided ID."));
    error_log("No doctor found with ID: " . $dr_id);
}
?>
