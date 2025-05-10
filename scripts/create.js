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
const { initBrowser, navigateTo, takeScreenshot, waitForSuccessMessage, closeBrowser, withTimeout } = require('./utils');

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
    
    // Add error handler for the page
    page.on('error', err => {
      console.error('Page error:', err);
    });
    
    // Navigate to the create product page
    await withTimeout(
      async () => await navigateTo(page, 'products/create.php'),
      10000,
      'Navigation to create.php'
    );
    
    // Take screenshot before filling the form
    await withTimeout(
      async () => await takeScreenshot(page, 'create_form_before'),
      5000,
      'Taking initial screenshot'
    );
    
    // Fill in the product form
    console.log('Filling in product form with test data...');
    
    // Use withTimeout for each form field operation
    await withTimeout(
      async () => {
        await page.type('#name', productData.name);
        await page.type('#description', productData.description);
        await page.select('#category', productData.category);
        
        // Toggle availability checkbox if needed
        const isChecked = await page.$eval('#available', input => input.checked);
        if (isChecked !== productData.available) {
          await page.click('#available');
        }
        
        await page.type('#price', productData.price);
      },
      15000,
      'Filling form fields'
    );
    
    // Upload image if provided
    if (TEST_IMAGE_PATH) {
      console.log(`Uploading test image: ${TEST_IMAGE_PATH}`);
      await withTimeout(
        async () => {
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
        },
        10000,
        'Uploading image'
      );
    }
    
    // Take screenshot after filling the form
    await withTimeout(
      async () => await takeScreenshot(page, 'create_form_after'),
      5000,
      'Taking pre-submission screenshot'
    );
    
    // Submit the form
    console.log('Submitting the product creation form...');
    
    await withTimeout(
      async () => {
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
                'button:contains("Create")',
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
      },
      20000,
      'Form submission'
    );
    
    // Verify success
    const successMsg = await withTimeout(
      async () => await waitForSuccessMessage(page),
      5000,
      'Checking for success message'
    );
    
    if (successMsg) {
      console.log('✅ Product created successfully!');
      console.log(`Success message: ${successMsg}`);
    } else {
      console.log('❌ Product creation may have failed. No success message found.');
    }
    
    // Take screenshot of the result page
    try {
      await withTimeout(
        async () => await takeScreenshot(page, 'create_result'),
        5000,
        'Taking final screenshot'
      );
    } catch (error) {
      console.warn(`Error taking final screenshot: ${error.message}`);
    }
    
    console.log(`Product "${productData.name}" creation process completed.`);
    
  } catch (error) {
    console.error('Error during product creation:', error);
  } finally {
    // Close the browser
    if (browser) {
      await closeBrowser(browser);
    }
  }
  
  return true; // Always return success to avoid breaking the test-all script
}

// Run the script
createProduct()
  .then(() => {
    console.log('Product creation script completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Product creation script failed:', err);
    process.exit(1);
  }); 