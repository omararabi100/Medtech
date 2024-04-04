<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    require 'PHPMailer/src/PHPMailer.php';
    require 'PHPMailer/src/SMTP.php';
    require 'PHPMailer/src/Exception.php';

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $email = $_POST['email'];
        $msg = $_POST['msg'];
        $fname = $_POST['fname'];
        $lname = $_POST['lname'];

        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';    
            $mail->SMTPAuth = true;

            $mail->Username = ''; // email
            $mail->Password = ''; // app password

            $mail->SMTPSecure = 'ssl';
            $mail->Port = 465;

            $mail->setFrom(''); // email
            $mail->addAddress('medtech364@gmail.com');

            $mail->Subject = "Contact form submission from $fname $lname";
            $mail->Body = "Email: $email\n\nMessage:\n$msg";

            $mail->send();
            header("Location: http://localhost:5173/contact-us/success");
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    } else {
        echo "Error! Something went wrong.";
    }
?>
