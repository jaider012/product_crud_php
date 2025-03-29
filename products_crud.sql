-- Create the database
CREATE DATABASE IF NOT EXISTS products_crud;
-- Select the database
USE products_crud;
-- Create the products table
CREATE TABLE products (
    code INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category ENUM(
        'Home Appliances',
        'Audio and Video',
        'Mobile Phones',
        'Computers',
        'Others'
    ) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255)
);
-- Insert sample data
INSERT INTO products (
        name,
        description,
        category,
        available,
        price,
        image
    )
VALUES (
        'Samsung TV 55"',
        '4K Smart TV with internet connection',
        'Audio and Video',
        TRUE,
        1299.99,
        'tv_samsung.jpg'
    ),
    (
        'LG Refrigerator',
        'Two-door No Frost refrigerator',
        'Home Appliances',
        TRUE,
        899.99,
        'refrigerator_lg.jpg'
    ),
    (
        'iPhone 13',
        'Smartphone with high resolution camera',
        'Mobile Phones',
        TRUE,
        999.99,
        'iphone13.jpg'
    ),
    (
        'HP Laptop',
        'Laptop with i7 processor and 16GB RAM',
        'Computers',
        TRUE,
        1199.99,
        'laptop_hp.jpg'
    ),
    (
        'Sony Headphones',
        'Wireless headphones with noise cancellation',
        'Audio and Video',
        FALSE,
        199.99,
        'headphones_sony.jpg'
    );