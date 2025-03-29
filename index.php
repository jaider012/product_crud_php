<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product CRUD System</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>Product CRUD System</h1>
            <nav>
                <ul>
                    <li><a href="index.php">Home</a></li>
                    <li><a href="products/list.php">List Products</a></li>
                    <li><a href="products/create.php">Create Product</a></li>
                    <li><a href="products/search.php">Search Product</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <div class="container">
        <div style="text-align: center; margin-top: 50px;">
            <h2>Welcome to the Product CRUD System</h2>
            <p>This system allows complete product management with the following functionalities:</p>
            
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; margin-top: 30px;">
                <div style="width: 200px; padding: 20px; background: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin: 10px;">
                    <h3>Create</h3>
                    <p>Add new products to the system</p>
                    <a href="products/create.php" class="btn">Go to Create</a>
                </div>
                
                <div style="width: 200px; padding: 20px; background: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin: 10px;">
                    <h3>List</h3>
                    <p>View all registered products</p>
                    <a href="products/list.php" class="btn">Go to List</a>
                </div>
                
                <div style="width: 200px; padding: 20px; background: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin: 10px;">
                    <h3>Update</h3>
                    <p>Modify information of existing products</p>
                    <a href="products/list.php" class="btn">Select Product</a>
                </div>
                
                <div style="width: 200px; padding: 20px; background: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin: 10px;">
                    <h3>Delete</h3>
                    <p>Remove products from the system</p>
                    <a href="products/list.php" class="btn">Select Product</a>
                </div>
            </div>
            
            <div style="margin-top: 40px;">
                <h3>Group Information</h3>
                <p><strong>Developed by:</strong> [Names of group members]</p>
                <p><strong>Group:</strong> [Group number]</p>
                <p><strong>Date:</strong> 03/29/2025</p>
            </div>
        </div>
    </div>
    
    <footer style="background: #333; color: #fff; text-align: center; padding: 10px; margin-top: 50px;">
        <div class="container">
            <p>Product CRUD System &copy; 2025</p>
        </div>
    </footer>
</body>
</html> 