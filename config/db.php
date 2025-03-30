<?php
/**
 * Database configuration file
 * 
 * This file contains the necessary parameters to establish
 * connection to the MySQL database.
 */

// Database connection parameters
$servername = getenv('DB_HOST') ?: 'localhost';
$username = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASSWORD') ?: '';
$dbname = getenv('DB_NAME') ?: 'products_crud';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Verify connection
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
}

// Set UTF-8 character set
$conn->set_charset("utf8");

/**
 * Function to clean input data
 * 
 * @param string $data Data to clean
 * @return string Cleaned data
 */
function cleanData($data) {
    global $conn;
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $data = $conn->real_escape_string($data);
    return $data;
} 