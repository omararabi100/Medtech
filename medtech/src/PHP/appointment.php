<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");

include_once("config.php");
 
$patient_email = str_replace('"', '', $_POST['patient_email']);
$dr_id = $_POST['dr_id'];
$date = $_POST['date'];
$start_time = $_POST['start_time'];
$end_time = $_POST['end_time'];

// Function to send email using PHPMailer
function sendEmail($recipientEmail, $subject, $body) {
    require 'vendor/autoload.php'; // Path to PHPMailer autoload file

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();                                            // Send using SMTP
        $mail->Host       = 'smtp.example.com';                     // SMTP server
        $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
        $mail->Username   = 'your@example.com';                     // SMTP username
        $mail->Password   = 'your_password';                        // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption
        $mail->Port       = 587;                                    // TCP port to connect to

        // Recipients
        $mail->setFrom('from@example.com', 'Your Name');
        $mail->addAddress($recipientEmail);                         // Add a recipient

        // Email content
        $mail->isHTML(true);                                        // Set email format to HTML
        $mail->Subject = $subject;
        $mail->Body    = $body;

        // Send email
        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}

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

            // Send email to the patient
            $subject = "Appointment Confirmation";
            $body = "Your appointment with Dr. $registered_dr has been reserved for $date at $start_time - $end_time.";
            sendEmail($patient_email, $subject, $body);

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
