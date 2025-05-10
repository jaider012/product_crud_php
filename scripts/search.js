/**
 * Search Products Automation Script
 * 
 * This script automates the process of searching for products in the web interface:
 * 1. Navigate to search.php
 * 2. Enter a search term (product code)
 * 3. Submit the search form
 * 4. Extract and display the search results
 */

require('dotenv').config();
const { initBrowser, navigateTo, takeScreenshot, closeBrowser } = require('./utils');

// Configuration
const DEFAULT_SEARCH_CODE = '1'; // Default product code to search for if none provided

async function searchProduct(productCode) {
  let browser;
  
  try {
    // Initialize browser and page
    const { browser: browserInstance, page } = await initBrowser();
    browser = browserInstance;
    
    console.log(`Starting product search automation for code: ${productCode}`);
    
    // Navigate to the search page
    await navigateTo(page, 'products/search.php');
    
    // Take screenshot before searching
    await takeScreenshot(page, 'search_form_before');
    
    // Fill in the search form with product code
    await page.type('#code', productCode);
    
    // Submit the search form
    console.log('Submitting search form...');
    
    // Take screenshot before clicking search
    await takeScreenshot(page, 'search_form_filled');
    
    // Click the search button and wait for results
    await Promise.all([
      page.click('button.btn'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
    
    // Take screenshot after search
    await takeScreenshot(page, 'search_results');
    
    // Check if product was found (fixing the selector)
    const productFound = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h3'));
      for (const h3 of headings) {
        if (h3.textContent.includes('Product Details')) {
          return true;
        }
      }
      return false;
    });
    
    const errorMessage = await page.$('.alert.alert-danger');
    
    if (productFound) {
      console.log('✅ Product found!');
      
      // Extract product details
      const productDetails = await page.evaluate(() => {
        const details = {};
        const rows = document.querySelectorAll('table tr');
        rows.forEach(row => {
          const header = row.querySelector('th').textContent.trim();
          const value = row.querySelector('td').textContent.trim();
          details[header] = value;
        });
        return details;
      });
      
      console.log('\nProduct Details:');
      console.table(productDetails);
      return productDetails;
      
    } else if (errorMessage) {
      const message = await page.evaluate(el => el.textContent.trim(), errorMessage);
      console.log(`❌ Search result: ${message}`);
      return null;
    } else {
      console.log('❓ Unexpected search result page structure');
      return null;
    }
    
  } catch (error) {
    console.error('Error during product search:', error);
    throw error;
  } finally {
    // Close the browser
    if (browser) {
      await closeBrowser(browser);
    }
  }
}

// Run the script
// Get product code from command-line arguments or use default
const productCode = process.argv[2] || DEFAULT_SEARCH_CODE;

searchProduct(productCode)
  .then(result => {
    console.log('Product search completed successfully');
    if (!result) {
      console.log(`No product found with code: ${productCode}`);
    }
  })
  .catch(err => {
    console.error('Product search failed:', err);
    process.exit(1);
  }); 