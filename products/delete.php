<?php
// Include database connection file
require_once('../config/db.php');

// Check if a product code has been provided
if (!isset($_GET['code']) || empty($_GET['code'])) {
    header("Location: list.php");
    exit();
}

$code = cleanData($_GET['code']);

// Get product information to possibly delete the image too
$sql = "SELECT image FROM products WHERE code = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $code);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $product = $result->fetch_assoc();
    
    // Delete the product from the database
    $sql = "DELETE FROM products WHERE code = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $code);
    
    if ($stmt->execute()) {
        // Delete the associated image if it exists
        if (!empty($product['image']) && file_exists("../images/" . $product['image'])) {
            unlink("../images/" . $product['image']);
        }
        
        // Redirect with success message
        header("Location: list.php?message=deleted");
        exit();
    } else {
        // If an error occurs, redirect with error message
        header("Location: list.php?error=Could not delete the product");
        exit();
    }
} else {
    // If the product doesn't exist, redirect
    header("Location: list.php");
    exit();
}

$stmt->close();
$conn->close();
?> 