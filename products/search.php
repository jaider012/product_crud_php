<?php
// Include database connection file
require_once('../config/db.php');

// Initialize variables
$product = null;
$message = "";
$search_performed = false;

// Process search form
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['code'])) {
    $code = cleanData($_POST['code']);
    
    // Verify code is not empty
    if (empty($code)) {
        $message = "Please enter a product code.";
    } else {
        // Search for product in database
        $sql = "SELECT * FROM products WHERE code = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $code);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $search_performed = true;
        
        if ($result->num_rows > 0) {
            $product = $result->fetch_assoc();
        } else {
            $message = "No product found with code " . $code;
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
    <title>Search Product</title>
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
        <h2>Search Product by Code</h2>
        
        <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
            <div class="form-group">
                <label for="code">Product Code:</label>
                <input type="number" id="code" name="code" min="1" required>
            </div>
            
            <div class="form-group">
                <button type="submit" class="btn">Search</button>
                <a href="list.php" class="btn">View All Products</a>
            </div>
        </form>
        
        <?php if (!empty($message)): ?>
            <div class="alert <?php echo ($product) ? 'alert-success' : 'alert-danger'; ?>">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>
        
        <?php if ($product): ?>
            <div style="margin-top: 30px;">
                <h3>Product Details</h3>
                
                <table>
                    <tr>
                        <th>Code</th>
                        <td><?php echo $product['code']; ?></td>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <td><?php echo $product['name']; ?></td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td><?php echo $product['description']; ?></td>
                    </tr>
                    <tr>
                        <th>Category</th>
                        <td><?php echo $product['category']; ?></td>
                    </tr>
                    <tr>
                        <th>Available</th>
                        <td><?php echo ($product['available'] ? 'Yes' : 'No'); ?></td>
                    </tr>
                    <tr>
                        <th>Price</th>
                        <td>$<?php echo number_format($product['price'], 2); ?></td>
                    </tr>
                    <tr>
                        <th>Image</th>
                        <td>
                            <?php if (!empty($product['image'])): ?>
                                <img src="../images/<?php echo $product['image']; ?>" alt="<?php echo $product['name']; ?>" style="max-width: 200px;">
                            <?php else: ?>
                                <span>No image</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                </table>
                
                <div style="margin-top: 20px;">
                    <a href="update.php?code=<?php echo $product['code']; ?>" class="btn">Edit this Product</a>
                    <a href="delete.php?code=<?php echo $product['code']; ?>" class="btn btn-danger" onclick="return confirmDeletion('<?php echo $product['name']; ?>')">Delete this Product</a>
                </div>
            </div>
        <?php elseif ($search_performed): ?>
            <p>No product found with the specified code.</p>
        <?php endif; ?>
    </div>
    
    <footer style="background: #333; color: #fff; text-align: center; padding: 10px; margin-top: 50px;">
        <div class="container">
            <p>Product CRUD System &copy; 2025</p>
        </div>
    </footer>
    
    <script src="../js/script.js"></script>
</body>
</html> 