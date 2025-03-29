<?php
// Include database connection file
require_once('../config/db.php');

// Check if a product code has been provided
if (!isset($_GET['code']) || empty($_GET['code'])) {
    header("Location: list.php");
    exit();
}

$code = cleanData($_GET['code']);

// Get product data
$sql = "SELECT * FROM products WHERE code = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $code);
$stmt->execute();
$result = $stmt->get_result();

// Verify if product exists
if ($result->num_rows == 0) {
    header("Location: list.php");
    exit();
}

$product = $result->fetch_assoc();
$stmt->close();

// Process the form when submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get and clean form data
    $name = cleanData($_POST['name']);
    $description = cleanData($_POST['description']);
    $category = cleanData($_POST['category']);
    $available = isset($_POST['available']) ? 1 : 0;
    $price = cleanData($_POST['price']);
    
    // Image handling
    $image = $product['image']; // Keep current image if no new one is uploaded
    
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $allowed = array("jpg" => "image/jpg", "jpeg" => "image/jpeg", "gif" => "image/gif", "png" => "image/png");
        $filename = $_FILES['image']['name'];
        $filetype = $_FILES['image']['type'];
        $filesize = $_FILES['image']['size'];
        
        // Verify file extension
        $ext = pathinfo($filename, PATHINFO_EXTENSION);
        if (!array_key_exists($ext, $allowed)) {
            $error_msg = "Error: Please select a valid file format.";
        }
        
        // Verify maximum size (5MB)
        $maxsize = 5 * 1024 * 1024;
        if ($filesize > $maxsize) {
            $error_msg = "Error: File size is larger than allowed (5MB).";
        }
        
        // Verify MIME type
        if (in_array($filetype, $allowed)) {
            // Check if the file exists before uploading
            if (file_exists("../images/" . $filename)) {
                $filename = time() . '_' . $filename;
            }
            
            if (move_uploaded_file($_FILES['image']['tmp_name'], "../images/" . $filename)) {
                // Delete previous image if it exists
                if (!empty($product['image']) && file_exists("../images/" . $product['image'])) {
                    unlink("../images/" . $product['image']);
                }
                $image = $filename;
            } else {
                $error_msg = "Error: A problem occurred while uploading the file.";
            }
        } else {
            $error_msg = "Error: There is a problem with the file type. Please verify it's an image.";
        }
    }
    
    // If no errors, update in database
    if (!isset($error_msg)) {
        $sql = "UPDATE products SET name = ?, description = ?, category = ?, available = ?, price = ?, image = ? WHERE code = ?";
                
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssiisi", $name, $description, $category, $available, $price, $image, $code);
        
        if ($stmt->execute()) {
            // Redirect to list with success message
            header("Location: list.php?message=updated");
            exit();
        } else {
            $error_msg = "Error: " . $stmt->error;
        }
        
        $stmt->close();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Product</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>Product CRUD System</h1>
            <nav>
                <ul>
                    <li><a href="../index.php">Home</a></li>
                    <li><a href="list.php">List Products</a></li>
                    <li><a href="create.php">Create Product</a></li>
                    <li><a href="search.php">Search Product</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <div class="container">
        <h2>Update Product</h2>
        
        <?php if (isset($error_msg)): ?>
            <div class="alert alert-danger">
                <?php echo $error_msg; ?>
            </div>
        <?php endif; ?>
        
        <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]) . "?code=" . $code; ?>" method="post" enctype="multipart/form-data" id="productForm">
            <div class="form-group">
                <label for="code">Code:</label>
                <input type="text" id="code" value="<?php echo $product['code']; ?>" disabled>
            </div>
            
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" value="<?php echo $product['name']; ?>" required>
            </div>
            
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" name="description" rows="4" required><?php echo $product['description']; ?></textarea>
            </div>
            
            <div class="form-group">
                <label for="category">Category:</label>
                <select id="category" name="category" required>
                    <option value="">Select a category</option>
                    <option value="Home Appliances" <?php if ($product['category'] == 'Home Appliances') echo 'selected'; ?>>Home Appliances</option>
                    <option value="Audio and Video" <?php if ($product['category'] == 'Audio and Video') echo 'selected'; ?>>Audio and Video</option>
                    <option value="Mobile Phones" <?php if ($product['category'] == 'Mobile Phones') echo 'selected'; ?>>Mobile Phones</option>
                    <option value="Computers" <?php if ($product['category'] == 'Computers') echo 'selected'; ?>>Computers</option>
                    <option value="Others" <?php if ($product['category'] == 'Others') echo 'selected'; ?>>Others</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="available">Available:</label>
                <input type="checkbox" id="available" name="available" <?php if ($product['available']) echo 'checked'; ?>>
            </div>
            
            <div class="form-group">
                <label for="price">Price:</label>
                <input type="number" id="price" name="price" step="0.01" min="0" value="<?php echo $product['price']; ?>" required>
            </div>
            
            <div class="form-group">
                <label for="image">Image:</label>
                <input type="file" id="image" name="image" accept="image/*">
                
                <?php if (!empty($product['image'])): ?>
                    <p>Current image:</p>
                    <img src="../images/<?php echo $product['image']; ?>" alt="<?php echo $product['name']; ?>" style="max-width: 200px; margin-top: 10px;">
                <?php endif; ?>
                
                <img id="previewImage" src="#" alt="Preview" style="display: none; max-width: 200px; margin-top: 10px;">
            </div>
            
            <div class="form-group">
                <button type="submit" class="btn btn-success">Update Product</button>
                <a href="list.php" class="btn">Cancel</a>
            </div>
        </form>
    </div>
    
    <footer style="background: #333; color: #fff; text-align: center; padding: 10px; margin-top: 50px;">
        <div class="container">
            <p>Product CRUD System &copy; 2025</p>
        </div>
    </footer>
    
    <script src="../js/script.js"></script>
</body>
</html> 