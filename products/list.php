<?php
// Include database connection file
require_once('../config/db.php');

// Query all products
$sql = "SELECT * FROM products ORDER BY name ASC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>List Products</title>
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
        <h2>Product List</h2>
        
        <?php
        // Show success message if it exists
        if (isset($_GET['message']) && $_GET['message'] == 'created') {
            echo '<div class="alert alert-success">The product has been successfully created.</div>';
        } elseif (isset($_GET['message']) && $_GET['message'] == 'updated') {
            echo '<div class="alert alert-success">The product has been successfully updated.</div>';
        } elseif (isset($_GET['message']) && $_GET['message'] == 'deleted') {
            echo '<div class="alert alert-success">The product has been successfully deleted.</div>';
        }
        ?>
        
        <a href="create.php" class="btn btn-success" style="margin-bottom: 20px;">Create New Product</a>
        
        <?php if ($result->num_rows > 0): ?>
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Available</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while($row = $result->fetch_assoc()): ?>
                        <tr>
                            <td><?php echo $row['code']; ?></td>
                            <td><?php echo $row['name']; ?></td>
                            <td><?php echo $row['category']; ?></td>
                            <td><?php echo ($row['available'] ? 'Yes' : 'No'); ?></td>
                            <td>$<?php echo number_format($row['price'], 2); ?></td>
                            <td>
                                <?php if (!empty($row['image'])): ?>
                                    <img src="../images/<?php echo $row['image']; ?>" alt="<?php echo $row['name']; ?>" class="product-image">
                                <?php else: ?>
                                    <span>No image</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <a href="update.php?code=<?php echo $row['code']; ?>" class="btn">Edit</a>
                                <a href="delete.php?code=<?php echo $row['code']; ?>" class="btn btn-danger" onclick="return confirmDeletion('<?php echo $row['name']; ?>')">Delete</a>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p>No products registered.</p>
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