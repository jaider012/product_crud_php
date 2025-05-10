/**
 * Update Product Automation Script
 * 
 * This script automates the process of updating a product in the web interface:
 * 1. Navigate to list.php to find a product to update
 * 2. Click the "Edit" link for the first product
 * 3. Modify fields and possibly upload a new image
 * 4. Submit the update form
 * 5. Verify the success message
 */

const path = require('path');
require('dotenv').config();
const { initBrowser, navigateTo, takeScreenshot, waitForSuccessMessage, closeBrowser } = require('./utils');

// Configuration
const TEST_IMAGE_PATH = process.env.TEST_IMAGE_PATH || path.join(__dirname, '../test-data/sample-product.jpg');
const PRODUCT_CODE = process.argv[2]; // Optional: product code from command line

// Data to update
const updateData = {
  name: `Updated Product ${Date.now()}`,
  description: 'This product was updated via Puppeteer automation',
  category: 'Audio and Video',
  available: true,
  price: '599.99',
  updateImage: false // Set to true to update the image
};

async function updateProduct() {
  let browser;
  
  try {
    // Initialize browser and page
    const { browser: browserInstance, page } = await initBrowser();
    browser = browserInstance;
    
    console.log('Starting product update automation...');
    
    // If product code is provided, go directly to the update page
    if (PRODUCT_CODE) {
      await navigateTo(page, `products/update.php?code=${PRODUCT_CODE}`);
    } else {
      // Navigate to the product list page to find a product to update
      await navigateTo(page, 'products/list.php');
      
      // Take screenshot of the product list
      await takeScreenshot(page, 'update_product_list');
      
      // Wait for the table to load
      await page.waitForSelector('table tbody tr', { timeout: 5000 })
        .catch(() => {
          throw new Error('No products found to update. Please create a product first.');
        });
      
      // Get the first product's edit link
      const editLink = await page.$('table tbody tr:first-child a.btn:not(.btn-danger)');
      if (!editLink) {
        throw new Error('Could not find the edit link for any product.');
      }
      
      // Click on the edit link to go to the update page
      console.log('Navigating to the update page for the first product...');
      await Promise.all([
        editLink.click(),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
      ]);
    }
    
    // We should now be on the update page
    // Capture the current product code and name for logging
    const currentCode = await page.$eval('#code', el => el.value);
    const currentName = await page.$eval('#name', el => el.value);
    
    console.log(`Updating product: ${currentName} (Code: ${currentCode})`);
    
    // Take screenshot before updating
    await takeScreenshot(page, 'update_form_before');
    
    // Clear existing fields and fill with new data
    await page.$eval('#name', el => el.value = '');
    await page.type('#name', updateData.name);
    
    await page.$eval('#description', el => el.value = '');
    await page.type('#description', updateData.description);
    
    await page.select('#category', updateData.category);
    
    // Toggle availability checkbox if needed
    const isChecked = await page.$eval('#available', input => input.checked);
    if (isChecked !== updateData.available) {
      await page.click('#available');
    }
    
    await page.$eval('#price', el => el.value = '');
    await page.type('#price', updateData.price);
    
    // Upload a new image if configured
    if (updateData.updateImage && TEST_IMAGE_PATH) {
      console.log(`Uploading new image: ${TEST_IMAGE_PATH}`);
      const fileInput = await page.$('#image');
      await fileInput.uploadFile(TEST_IMAGE_PATH);
      
      // Try to wait for image preview to appear, with multiple selector options
      try {
        // Check for various possible image preview selectors
        const previewSelectors = [
          '#previewImage[src^="data:image"]',
          '#previewImage:not([src="#"])',
          'img.preview',
          'img[src^="data:image"]'
        ];
        
        let previewFound = false;
        for (const selector of previewSelectors) {
          try {
            await page.waitForSelector(selector, { timeout: 2000 });
            console.log(`Image preview detected using selector: ${selector}`);
            previewFound = true;
            break;
          } catch (err) {
            // Continue to next selector
          }
        }
        
        if (!previewFound) {
          console.log('Image preview not detected, but continuing anyway...');
        }
      } catch (err) {
        console.log('Image preview detection error, but continuing anyway...');
      }
    }
    
    // Take screenshot after filling the form
    await takeScreenshot(page, 'update_form_after');
    
    // Submit the form
    console.log('Submitting the product update form...');

    try {
      // First try with Promise.all and wait for navigation
      await Promise.all([
        page.click('.btn.btn-success'),
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 })
      ]).catch(async (err) => {
        console.log('Navigation timeout after form submission. Trying alternative approach...');
        
        // If navigation timeout, try just clicking the button
        await page.click('.btn.btn-success').catch(async (err) => {
          console.log('Error clicking primary button. Trying alternative buttons...');
          
          // Try alternative button selectors
          const buttonSelectors = [
            'button[type="submit"]',
            'input[type="submit"]',
            'button:contains("Save")',
            'button:contains("Update")',
            'button.btn', 
            'form .btn'
          ];
          
          for (const selector of buttonSelectors) {
            try {
              const buttonExists = await page.$(selector);
              if (buttonExists) {
                console.log(`Trying to click button with selector: ${selector}`);
                await page.click(selector);
                break;
              }
            } catch (err) {
              // Continue to next selector
            }
          }
        });
        
        // Wait for any kind of navigation or response
        try {
          await page.waitForNavigation({ timeout: 5000 }).catch(() => {
            console.log('No navigation occurred after form submission');
          });
        } catch (err) {
          console.log('Continuing after form submission without navigation');
        }
      });
    } catch (err) {
      console.log(`Form submission error: ${err.message}`);
    }
    
    // Verify success
    const successMsg = await waitForSuccessMessage(page);
    
    if (successMsg) {
      console.log('✅ Product updated successfully!');
      console.log(`Success message: ${successMsg}`);
    } else {
      console.log('❌ Product update may have failed. No success message found.');
    }
    
    // Take screenshot of the result page
    await takeScreenshot(page, 'update_result');
    
    console.log(`Product updated from "${currentName}" to "${updateData.name}".`);
    
  } catch (error) {
    console.error('Error during product update:', error);
    throw error;
  } finally {
    // Close the browser
    if (browser) {
      await closeBrowser(browser);
    }
  }
}

// Run the script
updateProduct()
  .then(() => console.log('Product update script completed successfully'))
  .catch(err => {
    console.error('Product update script failed:', err);
    process.exit(1);
  }); 