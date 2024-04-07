<?php
$servername = "localhost";
$username = "root";
$password = "0000";
$db_name = "medtech";

// Attempt to create a MySQLi connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS medtech";
// $sql_drop_old_table = "DROP DATABASE IF EXISTS medtech";
// if ($conn->query($sql_drop_old_table) === FALSE) {
//     echo "Error dropping old table: " . $conn->error;
// }
if ($conn->query($sql) === FALSE) {
    echo "Error creating database: " . $conn->error;
}

// Connect to the database
$conn = new mysqli($servername, $username, $password, $db_name);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create users table
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
    phone_nb  CHAR(10) NOT NULL,
    gender VARCHAR(255) ,
    dateofbirth VARCHAR(20),
    history VARCHAR(500),
    allergies VARCHAR(500),
    registered_dr VARCHAR(255),
    registered_time VARCHAR(255),
    vists_nb CHAR(255),
    diagnosis VARCHAR(255),
    rating CHAR(7)
)";

// $sql_drop_old_table = "DROP TABLE IF EXISTS users";
// if ($conn->query($sql_drop_old_table) === FALSE) {
//     echo "Error dropping old table: " . $conn->error;
// }

if ($conn->query($sql) === FALSE) {
    echo "Error creating table: " . $conn->error;
}
$email = "admin@admin.com"; 
$sql_check_account = "SELECT * FROM users WHERE email = ?";
$stmt_check_account = $conn->prepare($sql_check_account);
$stmt_check_account->bind_param("s", $email);
$stmt_check_account->execute();
$result_check_account = $stmt_check_account->get_result();
// Insert admin user
if ($result_check_account->num_rows === 0) {
    $full_name = "Admin User";
    $password = password_hash("admin123", PASSWORD_DEFAULT); 
    $phone_nb = "1234567890";
    $gender = "male";
    $dateofbirth = "1990-01-01";

    $sql_insert_admin = "INSERT INTO users (full_name, email, password, phone_nb, gender, dateofbirth, rating) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt_insert_admin = $conn->prepare($sql_insert_admin);
    $stmt_insert_admin->bind_param("ssssssi", $full_name, $email, $password, $phone_nb, $gender, $dateofbirth, $rating);

    $rating = 5; // Set default rating for admin
    if ($stmt_insert_admin->execute()) {
        echo "Admin account inserted successfully!";
    } else {
        echo "Error inserting admin user: " . $stmt_insert_admin->error;
    }
    $full_name = "Admin";
    $password = password_hash("admin", PASSWORD_DEFAULT); 
    $phone_nb = "78905441";
    $gender = "male";
    $dateofbirth = "2003-05-20";
    $email = "admin2@example.com"; 

//     $sql_insert_admin = "INSERT INTO users (full_name, email, password, phone_nb, gender, dateofbirth) 
//                         VALUES (?, ?, ?, ?, ?, ?)";
//     $stmt_insert_admin = $conn->prepare($sql_insert_admin);
//     $stmt_insert_admin->bind_param("ssssss", $full_name, $email, $password, $phone_nb, $gender, $dateofbirth);

//     if ($stmt_insert_admin->execute()) {
//         echo "Admin account inserted successfully!";
//     } else {
//         echo "Error inserting admin user: " . $stmt_insert_admin->error;
//     }
}

// Create doctors table
$sql_create_doctors = "CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    image LONGBLOB NOT NULL,
    times TEXT,
    date_available VARCHAR(50) NOT NULL,
    phone_nb CHAR(10) NOT NULL,
    starting_date DATE NOT NULL
)";
$conn->query($sql_create_doctors);
if ($conn->query($sql_create_doctors) === FALSE) {
    echo "Error creating table: " . $conn->error;
}

// Insert doctors into the table
$doctors = [
    [
        "full_name" => "Julian Jameson",
        "image" => "./public/Julian.png",
        "times" => [
            ["day" => "Monday", "slots" => [["starting_time" => "9:00", "ending_time" => "12:00"], ["starting_time" => "13:00", "ending_time" => "17:00"]]]
        ],
        "date_available" => "Monday",
        "phone_nb" => "76056804",
        "starting_date" => date("Y-m-d H:i:s")
    ],
    [
        "full_name" => "Jack Griffins",
        "image" => "./public/Jack.png",
        "times" => [
            ["day" => "Friday", "slots" => [["starting_time" => "10:00", "ending_time" => "12:00"], ["starting_time" => "13:00", "ending_time" => "17:00"]]]
        ],
        "date_available" => "Friday",
        "phone_nb" => "76056804",
        "starting_date" => date("Y-m-d H:i:s")
    ],
    [
        "full_name" => "Amy Watterson",
        "image" => "./public/Amy.png",
        "times" => [
            ["day" => "Wednesday", "slots" => [["starting_time" => "00:00", "ending_time" => "17:00"]]]
        ],
        "date_available" => "Wednesday",
        "phone_nb" => "78905441",
        "starting_date" => date("Y-m-d H:i:s")
    ],
    [
        "full_name" => "Walter White",
        "image" => "./public/Walter.png",
        "times" => [
            ["day" => "Tuesday", "slots" => [["starting_time" => "9:00", "ending_time" => "12:00"], ["starting_time" => "13:00", "ending_time" => "17:00"]]]
        ],
        "date_available" => "Tuesday",
        "phone_nb" => "7890123456",
        "starting_date" => date("Y-m-d H:i:s")
    ]
];


foreach ($doctors as $doctor) {
    $full_name = $doctor['full_name'];
    $image = $doctor['image'];
    $times = serialize($doctor['times']);
    $date_available = $doctor['date_available'];
    $phone_nb = $doctor['phone_nb'];
    $starting_date = $doctor['starting_date'];
    
    $sql_check_doctor = "SELECT COUNT(*) AS count FROM doctors WHERE full_name = '$full_name'";
    $result_check_doctor = $conn->query($sql_check_doctor);
    $row_check_doctor = $result_check_doctor->fetch_assoc();
    $doctor_exists = $row_check_doctor['count'] > 0;
    
    // if (!$doctor_exists) {
    //     $sql_insert_doctor = "INSERT INTO doctors (full_name, image, times, date_available, phone_nb, starting_date) VALUES ('$full_name', '$image', '$times', '$date_available', '$phone_nb', '$starting_date')";
        
    //     if ($conn->query($sql_insert_doctor) === TRUE) {
    //         echo "Doctor $full_name inserted successfully<br>";
    //     } else {
    //         echo "Error inserting doctor $full_name: " . $conn->error . "<br>";
    //     }
    // } else {
    //     echo "Doctor $full_name already exists in the table<br>";
    // }
}
// drop dr
// $sql_drop_old_table = "DROP TABLE IF EXISTS doctors";
// if ($conn->query($sql_drop_old_table) === FALSE) {
//     echo "Error dropping old table: " . $conn->error;
// }




// Delete associated records from the diagnosis table
// $sql_delete_diagnosis = "DELETE FROM diagnosis WHERE dr_id IN (SELECT id FROM doctors)";

// if ($conn->query($sql_delete_diagnosis) === TRUE) {
//     echo "Associated records from the diagnosis table have been deleted successfully!";
// } else {
//     echo "Error deleting associated records from the diagnosis table: " . $conn->error;
//     // Add additional error handling or debugging steps if necessary
// }

// // Now, delete records from the doctors table only if deletion from the diagnosis table was successful
// if ($conn->query($sql_delete_diagnosis) === TRUE) {
//     // Now, delete records from the doctors table
//     $sql_delete_doctors = "DELETE FROM doctors";

//     if ($conn->query($sql_delete_doctors) === TRUE) {
//         echo "All records from the doctors table have been deleted successfully!";
//     } else {
//         echo "Error deleting records from doctors table: " . $conn->error;
//     }
// } else {
//     echo "Skipping deletion of records from the doctors table due to errors in deleting associated records from the diagnosis table.";
// }



$sql = "CREATE TABLE IF NOT EXISTS appointment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    dr_id INT,
    date DATE,
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (dr_id) REFERENCES doctors(id)    
)";
// $sql_drop_old_table = "DROP TABLE IF EXISTS appointment";
// if ($conn->query($sql_drop_old_table) === FALSE) {
//     echo "Error dropping old table: " . $conn->error;
// }

if ($conn->query($sql) === FALSE) {
    echo "Error creating table: " . $conn->error;
}

$sql = "CREATE TABLE IF NOT EXISTS diagnosis  (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    dr_id INT,
    diagnosis VARCHAR(255),
    date DATE,
    image LONGBLOB,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (dr_id) REFERENCES doctors(id)
)";



if ($conn->query($sql) === FALSE) {
    echo "Error creating table: " . $conn->error;
}




// $full_name = "shahed";
// $email = "shahed3@example.com";
// $password = password_hash("1", PASSWORD_DEFAULT); // Hashed password
// $phone_nb = "1234567890";
// $gender = "female";
// $dateofbirth = "1990-05-20";
// $registered_dr = "Julian Jameson"; // Example value for registered_dr
// $rating = 4; // Example value for rating
// // // Prepare and execute SQL query to insert data into users table
// $sql_insert_user = "INSERT INTO users (full_name, email, password, phone_nb, gender, dateofbirth, registered_dr, rating) 
//                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
// $stmt_user = $conn->prepare($sql_insert_user);
// $stmt_user->bind_param("sssssssi", $full_name, $email, $password, $phone_nb, $gender, $dateofbirth, $registered_dr, $rating);

// if ($stmt_user->execute()) {
//     echo "Patient data inserted successfully!";
    
//     // Get the inserted user ID
//     $user_id = $stmt_user->insert_id;

//     // Specific values for diagnosis data
//     $diagnosis = "Fever";
//     $date_diagnosis = date("Y-m-d");
//     $dr_id = 1; // Assuming the doctor ID is 1
//     $user_id = 8;
//     // Insert data into diagnosis table
//     $sql_insert_diagnosis = "INSERT INTO diagnosis (patient_id,dr_id, diagnosis, date) VALUES (?, ?,?, ?)";
//     $stmt_diagnosis = $conn->prepare($sql_insert_diagnosis);
//     $stmt_diagnosis->bind_param("iiss", $user_id, $dr_id, $diagnosis, $date_diagnosis);
//     $stmt_diagnosis->execute();

//     // Specific values for appointment data
//     $dr_id = 1; // Assuming the doctor ID is 1
//     $date = "2024-03-20";
//     $time = "10:00:00";

//     // Insert data into appointment table
//     $sql_insert_appointment = "INSERT INTO appointment (patient_id, dr_id, date, time) VALUES (?, ?, ?, ?)";
//     $stmt_appointment = $conn->prepare($sql_insert_appointment);
//     $stmt_appointment->bind_param("iiss", $user_id, $dr_id, $date, $time);
//     $stmt_appointment->execute();

//     echo "Diagnosis and Appointment data inserted successfully!";
// } else {
//     echo "Error inserting patient data: " . $stmt_user->error;
// }




// Close the connection
// $conn->close();
?>
