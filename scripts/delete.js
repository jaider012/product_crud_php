/**
 * Delete Product Automation Script
 * 
 * This script automates the process of deleting a product in the web interface:
 * 1. Navigate to list.php to find a product to delete
 * 2. Click the "Delete" link for the first product
 * 3. Handle the confirmation dialog
 * 4. Verify the success message
 */

require('dotenv').config();
const { initBrowser, navigateTo, takeScreenshot, waitForSuccessMessage, closeBrowser } = require('./utils');

// Configuration
const PRODUCT_CODE = process.argv[2]; // Optional: product code from command line

async function deleteProduct() {
  let browser;
  
  try {
    // Initialize browser and page
    const { browser: browserInstance, page } = await initBrowser();
    browser = browserInstance;
    
    console.log('Starting product deletion automation...');
    
    // If product code is provided, go directly to delete it
    if (PRODUCT_CODE) {
      console.log(`Deleting product with code: ${PRODUCT_CODE}`);
      
      // Set up confirmation dialog handler
      page.on('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        await dialog.accept();
        console.log('Deletion confirmed in dialog');
      });
      
      // Navigate directly to delete.php with the product code
      await navigateTo(page, `products/delete.php?code=${PRODUCT_CODE}`);
      
      // The page should redirect to list.php with a success message
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      
    } else {
      // Navigate to the product list page to find a product to delete
      await navigateTo(page, 'products/list.php');
      
      // Take screenshot of the product list
      await takeScreenshot(page, 'delete_product_list');
      
      // Wait for the table to load
      await page.waitForSelector('table tbody tr', { timeout: 5000 })
        .catch(() => {
          throw new Error('No products found to delete. Please create a product first.');
        });
      
      // Get the first product's information for logging
      const productName = await page.$eval('table tbody tr:first-child td:nth-child(2)', el => el.textContent.trim());
      const productCode = await page.$eval('table tbody tr:first-child td:first-child', el => el.textContent.trim());
      
      console.log(`Preparing to delete product: ${productName} (Code: ${productCode})`);
      
      // Set up confirmation dialog handler
      page.on('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        await dialog.accept();
        console.log('Deletion confirmed in dialog');
      });
      
      // Get the first product's delete link
      const deleteLink = await page.$('table tbody tr:first-child a.btn.btn-danger');
      if (!deleteLink) {
        throw new Error('Could not find the delete link for any product.');
      }
      
      // Click on the delete link
      console.log('Clicking delete link...');
      await Promise.all([
        deleteLink.click(),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
      ]);
    }
    
    // Verify success
    const successMsg = await waitForSuccessMessage(page);
    
    if (successMsg) {
      console.log('✅ Product deleted successfully!');
      console.log(`Success message: ${successMsg}`);
    } else {
      console.log('❌ Product deletion may have failed. No success message found.');
    }
    
    // Take screenshot of the result page
    await takeScreenshot(page, 'delete_result');
    
  } catch (error) {
    console.error('Error during product deletion:', error);
    throw error;
  } finally {
    // Close the browser
    if (browser) {
      await closeBrowser(browser);
    }
  }
}

// Run the script
deleteProduct()
  .then(() => console.log('Product deletion script completed successfully'))
  .catch(err => {
    console.error('Product deletion script failed:', err);
    process.exit(1);
  }); 