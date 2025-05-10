/**
 * Read/List Products Automation Script
 * 
 * This script automates the process of listing products in the web interface:
 * 1. Navigate to list.php
 * 2. Extract product data from the table
 * 3. Output the list of products to console or save to JSON
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { initBrowser, navigateTo, takeScreenshot, extractProductData, closeBrowser } = require('./utils');

// Configuration
const MAX_PRODUCTS = 5; // Maximum number of products to extract
const SAVE_TO_JSON = true; // Set to true to save products to a JSON file

async function listProducts() {
  let browser;
  
  try {
    // Initialize browser and page
    const { browser: browserInstance, page } = await initBrowser();
    browser = browserInstance;
    
    console.log('Starting product listing automation...');
    
    // Navigate to the product list page
    await navigateTo(page, 'products/list.php');
    
    // Take screenshot of the product list
    await takeScreenshot(page, 'product_list');
    
    // Check if there are any products - using text content instead of :contains selector
    const noProductsText = await page.evaluate(() => {
      const paragraphs = Array.from(document.querySelectorAll('p'));
      for (const p of paragraphs) {
        if (p.textContent.includes('No products registered')) {
          return true;
        }
      }
      return false;
    });
    
    if (noProductsText) {
      console.log('No products found in the database.');
      return [];
    }
    
    // Get all product rows from the table
    console.log('Extracting product data from the table...');
    
    // Wait for the table to be present
    await page.waitForSelector('table tbody tr', { timeout: 5000 })
      .catch(() => {
        console.log('No product table found. There might be no products.');
        return [];
      });
    
    // Get all rows
    const rows = await page.$$('table tbody tr');
    
    // Limit to maximum number of products
    const productsToExtract = Math.min(rows.length, MAX_PRODUCTS);
    console.log(`Found ${rows.length} products. Extracting the first ${productsToExtract}.`);
    
    // Extract data from each row
    const products = [];
    for (let i = 0; i < productsToExtract; i++) {
      const productData = await extractProductData(rows[i]);
      products.push(productData);
    }
    
    // Display products in console
    console.log('\nExtracted Products:');
    console.table(products);
    
    // Save to JSON if configured
    if (SAVE_TO_JSON && products.length > 0) {
      // Create data directory if it doesn't exist
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
      }
      
      // Save to file with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filePath = path.join(dataDir, `products_${timestamp}.json`);
      
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
      console.log(`\nProducts saved to: ${filePath}`);
    }
    
    return products;
    
  } catch (error) {
    console.error('Error during product listing:', error);
    throw error;
  } finally {
    // Close the browser
    if (browser) {
      await closeBrowser(browser);
    }
  }
}

// Filter products by category function
async function filterProductsByCategory(category) {
  let browser;
  
  try {
    // Initialize browser and page
    const { browser: browserInstance, page } = await initBrowser();
    browser = browserInstance;
    
    console.log(`Filtering products by category: ${category}`);
    
    // Navigate to the product list page
    await navigateTo(page, 'products/list.php');
    
    // Take screenshot before filtering
    await takeScreenshot(page, 'product_list_before_filter');
    
    // Get all product rows from the table
    const rows = await page.$$('table tbody tr');
    
    // Filter products by category
    const filteredProducts = [];
    for (const row of rows) {
      const product = await extractProductData(row);
      if (product.category === category) {
        filteredProducts.push(product);
      }
    }
    
    console.log(`\nFound ${filteredProducts.length} products in category "${category}":`);
    console.table(filteredProducts);
    
    return filteredProducts;
    
  } catch (error) {
    console.error('Error during product filtering by category:', error);
    throw error;
  } finally {
    // Close the browser
    if (browser) {
      await closeBrowser(browser);
    }
  }
}

// Run the script
// If category is provided as command-line argument, filter by that category
const categoryArg = process.argv[2];

if (categoryArg) {
  filterProductsByCategory(categoryArg)
    .then(() => console.log('Product filtering completed successfully'))
    .catch(err => {
      console.error('Product filtering failed:', err);
      process.exit(1);
    });
} else {
  listProducts()
    .then(() => console.log('Product listing completed successfully'))
    .catch(err => {
      console.error('Product listing failed:', err);
      process.exit(1);
    });
} 