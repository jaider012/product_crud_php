/**
 * Create Product Automation Script
 * 
 * This script automates the process of creating a new product in the web interface:
 * 1. Navigate to create.php
 * 2. Fill in all product fields
 * 3. Upload a test image
 * 4. Submit the form
 * 5. Verify the success message
 */

const path = require('path');
require('dotenv').config();
const { initBrowser, navigateTo, takeScreenshot, waitForSuccessMessage, closeBrowser } = require('./utils');

// Configure test data
const TEST_IMAGE_PATH = process.env.TEST_IMAGE_PATH || path.join(__dirname, '../test-data/sample-product.jpg');
const productData = {
  name: `Test Product ${Date.now()}`,
  description: 'This is an automated test product created with Puppeteer',
  category: 'Computers',
  available: true,
  price: '499.99'
};

async function createProduct() {
  let browser;
  
  try {
    // Initialize browser and page
    const { browser: browserInstance, page } = await initBrowser();
    browser = browserInstance;
    
    console.log('Starting product creation automation...');
    
    // Navigate to the create product page
    await navigateTo(page, 'products/create.php');
    
    // Take screenshot before filling the form
    await takeScreenshot(page, 'create_form_before');
    
    // Fill in the product form
    console.log('Filling in product form with test data...');
    await page.type('#name', productData.name);
    await page.type('#description', productData.description);
    await page.select('#category', productData.category);
    
    // Toggle availability checkbox if needed
    const isChecked = await page.$eval('#available', input => input.checked);
    if (isChecked !== productData.available) {
      await page.click('#available');
    }
    
    await page.type('#price', productData.price);
    
    // Upload image if provided
    if (TEST_IMAGE_PATH) {
      console.log(`Uploading test image: ${TEST_IMAGE_PATH}`);
      const fileInput = await page.$('#image');
      await fileInput.uploadFile(TEST_IMAGE_PATH);
      
      // Wait for image preview to appear
      await page.waitForSelector('#previewImage[src^="data:image"]', { timeout: 5000 })
        .catch(() => console.log('Image preview not detected, but continuing...'));
    }
    
    // Take screenshot after filling the form
    await takeScreenshot(page, 'create_form_after');
    
    // Submit the form
    console.log('Submitting the product creation form...');
    await Promise.all([
      page.click('.btn.btn-success'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
    
    // Verify success
    const successMsg = await waitForSuccessMessage(page);
    
    if (successMsg) {
      console.log('✅ Product created successfully!');
      console.log(`Success message: ${successMsg}`);
    } else {
      console.log('❌ Product creation may have failed. No success message found.');
    }
    
    // Take screenshot of the result page
    await takeScreenshot(page, 'create_result');
    
    console.log(`Product "${productData.name}" creation process completed.`);
    
  } catch (error) {
    console.error('Error during product creation:', error);
    throw error;
  } finally {
    // Close the browser
    if (browser) {
      await closeBrowser(browser);
    }
  }
}

// Run the script
createProduct()
  .then(() => console.log('Product creation script completed successfully'))
  .catch(err => {
    console.error('Product creation script failed:', err);
    process.exit(1);
  }); 