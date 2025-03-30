# Product CRUD System

A product management system developed in PHP and MySQL that allows performing basic CRUD operations (Create, Read, Update, Delete) on products.

## Features

- Create new products with name, description, category, availability, and price
- Upload images for products
- List all registered products
- Update information of existing products
- Delete products from the system
- Search products by code

## Running with Docker (Recommended)

This project includes Docker configuration files to make it easy to run without installing PHP or MySQL locally.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Quick Start (Recommended)

The easiest way to run the project is by using the provided start script:

1. Clone the repository:
   ```
   git clone [repository-url]
   cd products-crud
   ```

2. Make the start script executable and run it:
   ```
   chmod +x start.sh
   bash start.sh
   ```

3. Access the application in your browser:
   ```
   http://localhost:8080
   ```

4. To stop the application:
   ```
   docker-compose down
   ```

### Manual Setup

If you prefer to set up manually:

1. Clone the repository:
   ```
   git clone [repository-url]
   cd products-crud
   ```

2. Copy the example environment file:
   ```
   cp .env.example .env
   ```

3. Create the images directory with correct permissions:
   ```
   mkdir -p images
   chmod 755 images
   ```

4. Start the Docker containers:
   ```
   docker-compose up -d
   ```

5. Access the application in your browser:
   ```
   http://localhost:8080
   ```

6. To stop the containers:
   ```
   docker-compose down
   ```

### Environment Variables

The following environment variables can be configured in the `.env` file:

- `DB_HOST`: Database hostname (default: `db`)
- `DB_USER`: Database username (default: `root`)
- `DB_PASSWORD`: Database password (default: `rootpassword`)
- `DB_NAME`: Database name (default: `products_crud`)
- `DB_ROOT_PASSWORD`: MySQL root password (default: `rootpassword`)
- `WEB_PORT`: Web server port (default: `8080`)

### Troubleshooting Docker Setup

If you encounter issues:

1. Check that Docker and Docker Compose are installed:
   ```
   docker --version
   docker-compose --version
   ```

2. Make sure Docker service is running:
   ```
   docker info
   ```

3. Check container status:
   ```
   docker-compose ps
   ```

4. View container logs:
   ```
   docker-compose logs
   ```

5. Access MySQL container directly:
   ```
   docker-compose exec db mysql -uroot -prootpassword products_crud
   ```

## Manual Installation

If you prefer not to use Docker, you can install the application manually:

### Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache, Nginx, etc.)

### Installation Steps

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
├── docker/                   # Docker configuration files
│   └── php/
│       └── php.ini           # PHP configuration
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Docker image configuration
└── products_crud.sql         # SQL script for database
```

## Usage

1. Access the application in your browser
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