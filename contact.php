<?php
    require 'vendor/autoload.php';
 
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    header('Content-Type: application/json; charset=UTF-8');
   
    $mail = new PHPMailer(true);
    $mail->isSMTP();

    $mail->Host = 'smtp.hostinger.com';
    $mail->Port = 465;
    $mail->SMTPAuth = true;
    $mail->Username = 'contact@aidanklee.co.uk';
    $mail->Password = 'J0seph!neCheung1101';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;

    $mail->setFrom('contact@aidanklee.co.uk', 'Aidan Lee');
    $mail->addReplyTo('contact@aidanklee.co.uk', 'Aidan Lee');
    $mail->addAddress('contact@aidanklee.co.uk', 'Aidan Lee');
    $mail->addCC('aidankglee@googlemail.com');

    $mail->Subject = 'Message from ' . $_REQUEST['firstname'] . ' ' . $_REQUEST['lastname'] . ' ' . $_REQUEST['email'] . ' ' . $_REQUEST['company'];
    $mail->Body = $_REQUEST['message'];
    
    $output;

    if (!$mail->send()) {
        $output['code'] = "400";
        $output['name'] = "error";
        $output['description'] = 'Mailer Error: ' . $mail->ErrorInfo;
        $output['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    } else {
        $output['code'] = "200";
        $output['name'] = "ok";
        $output['description'] = 'Message sent successfully';
        $output['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    }

    echo json_encode($output);
?>