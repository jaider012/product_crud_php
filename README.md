# Product CRUD System

A product management system developed in PHP and MySQL that allows performing basic CRUD operations (Create, Read, Update, Delete) on products.

## Features

- Create new products with name, description, category, availability, and price
- Upload images for products
- List all registered products
- Update information of existing products
- Delete products from the system
- Search products by code

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache, Nginx, etc.)

## Installation

1. Clone or download this repository to your web server directory
2. Import the database using the `products_crud.sql` file
3. Configure the database connection parameters in `config/db.php`
4. Make sure the `images` directory has write permissions

### Database Configuration

The `config/db.php` file contains the database connection parameters. Modify as needed:

```php
$servername = "localhost"; // Database server
$username = "root";        // Database username
$password = "";            // Database password
$dbname = "products_crud"; // Database name
```

## Project Structure

```
/products-crud/
├── index.php                 # Home page with group information
├── config/
│   └── db.php                # Database configuration
├── products/
│   ├── create.php            # Form to create products
│   ├── list.php              # Lists all products
│   ├── update.php            # Updates an existing product
│   ├── delete.php            # Deletes a product
│   └── search.php            # Searches product by code
├── css/
│   └── style.css             # CSS styles
├── js/
│   └── script.js             # JavaScript validations
├── images/                   # Directory for product images
└── products_crud.sql         # SQL script for database
```

## Usage

1. Access `http://localhost/products-crud/` in your browser
2. From the home page, you can access all functionalities
3. To create a product, click on "Create Product"
4. To view, edit, or delete existing products, click on "List Products"
5. To search for a specific product by code, click on "Search Product"

## Group Information

- **Developed by:** [Names of group members]
- **Group:** [Group number]
- **Date:** 03/29/2025

## License

This project is for educational purposes. 