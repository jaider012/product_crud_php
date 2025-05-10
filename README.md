# Product CRUD PHP - Puppeteer Automation

This project contains Puppeteer automation scripts for testing a PHP/MySQL product CRUD application.

## Setup

1. Clone this repository
2. Install Node.js dependencies:
   ```
   npm install
   ```
3. Create a `.env` file at the root of the project (copy from `.env.example`) and adjust settings:
   ```
   # Base URL of the PHP application
   BASE_URL=http://localhost/product_crud_php

   # Path to test image for uploading
   TEST_IMAGE_PATH=./test-data/sample-product.jpg

   # Maximum wait time for page loading (in milliseconds)
   PAGE_TIMEOUT=30000

   # Browser settings
   HEADLESS=false
   SLOW_MO=50
   ```
4. Create a test image for product uploads:
   ```
   mkdir -p test-data
   # Add a sample product image to the test-data directory
   ```

## Available Scripts

### Create Product
Automates creating a new product with random name, description, and test image:
```
npm run create
# or
node scripts/create.js
```

### List Products
Lists the first 5 products from the database:
```
npm run read
# or
node scripts/read.js
```

Filter by category:
```
node scripts/read.js "Audio and Video"
```

### Search Product
Searches for a product by code:
```
npm run search
# or
node scripts/search.js 1
```

### Update Product
Updates the first product in the list (or a specific product by code):
```
npm run update
# or
node scripts/update.js
# or specify a product code
node scripts/update.js 1
```

### Delete Product
Deletes the first product in the list (or a specific product by code):
```
npm run delete
# or
node scripts/delete.js
# or specify a product code
node scripts/delete.js 1
```

### Run All Tests
Run all automation scripts in sequence:
```
npm run test-all
```

## Screenshots

Screenshots are automatically saved to the `screenshots` directory during script execution.

## Features

- Automated browser testing with Puppeteer
- Screenshot capture at each critical step
- Error handling and reporting
- Configurable through environment variables
- Product data extraction and JSON export

## Project Structure

```
.
├── .env                  # Environment configuration
├── package.json          # Project dependencies and scripts
├── README.md             # This documentation
├── data/                 # JSON output directory (created at runtime)
├── screenshots/          # Screenshots directory (created at runtime)
├── test-data/            # Test images for upload
└── scripts/
    ├── create.js         # Product creation script
    ├── read.js           # Product listing script
    ├── search.js         # Product search script
    ├── update.js         # Product update script
    ├── delete.js         # Product deletion script
    └── utils.js          # Shared utilities
```

## Notes

- Make sure your PHP application is running and accessible at the BASE_URL before running the scripts
- The browser will open in headless mode by default (set HEADLESS=false in .env to see the browser)
- Adjust the SLOW_MO setting to slow down operations for debugging 