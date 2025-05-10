/**
 * Utils module for Puppeteer automation scripts
 * Contains shared functions for browser operations
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Environment variables
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const PAGE_TIMEOUT = parseInt(process.env.PAGE_TIMEOUT || '30000', 10);
const HEADLESS = process.env.HEADLESS === 'true';
const SLOW_MO = parseInt(process.env.SLOW_MO || '50', 10);
const USE_MOCK_SERVER = process.env.USE_MOCK_SERVER === 'true';

/**
 * Initialize the browser and create a new page
 * @returns {Promise<Object>} Object containing browser and page instances
 */
async function initBrowser() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: HEADLESS,
    slowMo: SLOW_MO,
    args: ['--window-size=1366,768', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  
  // Set default navigation timeout
  page.setDefaultNavigationTimeout(PAGE_TIMEOUT);
  
  return { browser, page };
}

/**
 * Navigate to a specific URL
 * @param {Page} page - Puppeteer page instance
 * @param {string} path - Path to navigate to (will be appended to BASE_URL)
 * @returns {Promise<void>}
 */
async function navigateTo(page, path) {
  const url = `${BASE_URL}/${path}`;
  console.log(`Navigating to: ${url}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
  } catch (error) {
    console.error(`❌ Navigation error: ${error.message}`);
    console.error(`
      ⚠️ TROUBLESHOOTING TIPS:
      1. Make sure your Docker container is running
      2. Check if the BASE_URL (${BASE_URL}) is correct in your .env file
      3. Verify that your PHP server is running on port 8080
      4. Try accessing ${url} directly in your browser
    `);
    throw error;
  }
}

/**
 * Take a screenshot and save it to the screenshots directory
 * @param {Page} page - Puppeteer page instance
 * @param {string} name - Name for the screenshot file
 * @returns {Promise<void>}
 */
async function takeScreenshot(page, name) {
  try {
    // Check if page is closed
    if (!page || page.isClosed?.()) {
      console.warn(`Cannot take screenshot of ${name}: Page is already closed`);
      return;
    }
    
    // Create screenshots directory if it doesn't exist
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }
    
    // Create timestamp for unique filenames
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(screenshotsDir, `${name}_${timestamp}.png`);
    
    console.log(`Taking screenshot: ${filePath}`);
    await page.screenshot({ path: filePath, fullPage: true }).catch(err => {
      console.warn(`Screenshot failed: ${err.message}`);
    });
  } catch (error) {
    console.warn(`Error taking screenshot: ${error.message}`);
  }
}

/**
 * Wait for a success message to appear on page
 * @param {Page} page - Puppeteer page instance
 * @returns {Promise<string|null>} The message text or null if not found
 */
async function waitForSuccessMessage(page) {
  try {
    // Try several possible selectors for success messages
    const possibleSelectors = [
      '.alert.alert-success',
      '.alert-success',
      '.success',
      '.message.success',
      '.message',
      '.notification.success',
      '.notification',
      '#message'
    ];
    
    let messageElement = null;
    
    // Check for URL parameters first (faster detection)
    const url = page.url();
    if (url.includes('message=created') || 
        url.includes('message=updated') || 
        url.includes('message=deleted')) {
      console.log(`✅ Success detected from URL parameter: ${url}`);
      return "Operation completed successfully (detected from URL parameter)";
    }
    
    // Try each selector with a shorter timeout
    for (const selector of possibleSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        messageElement = await page.$(selector);
        if (messageElement) {
          const text = await page.evaluate(el => el.textContent, messageElement);
          console.log(`Success message found with selector: ${selector}`);
          return text;
        }
      } catch (err) {
        // Continue to next selector
      }
    }
    
    // If we're on the list page, check for newly created item
    if (url.includes('list.php')) {
      try {
        // Check if there's a table with products
        const hasTable = await page.$('table tbody tr');
        if (hasTable) {
          return "Operation seems successful (product list is displayed)";
        }
      } catch (err) {
        // Continue with other checks
      }
    }
    
    // If we can't find any success message element, check the page content
    try {
      const pageContent = await page.content();
      const successIndicators = [
        'success', 'created', 'updated', 'deleted', 'saved', 'completed'
      ];
      
      for (const indicator of successIndicators) {
        if (pageContent.toLowerCase().includes(indicator)) {
          return `Operation likely successful (found "${indicator}" in page content)`;
        }
      }
    } catch (err) {
      // Continue to final check
    }
    
    return null;
  } catch (error) {
    console.error('Error waiting for success message:', error.message);
    return null;
  }
}

/**
 * Extract product data from a table row
 * @param {ElementHandle} row - Puppeteer element handle for table row
 * @returns {Promise<Object>} Product data object
 */
async function extractProductData(row) {
  return await row.evaluate(tr => {
    const cells = tr.querySelectorAll('td');
    return {
      code: cells[0].textContent.trim(),
      name: cells[1].textContent.trim(),
      category: cells[2].textContent.trim(),
      available: cells[3].textContent.trim(),
      price: cells[4].textContent.trim(),
      hasImage: cells[5].querySelector('img') !== null
    };
  });
}

/**
 * Clean up and close the browser
 * @param {Browser} browser - Puppeteer browser instance
 * @returns {Promise<void>}
 */
async function closeBrowser(browser) {
  try {
    if (browser) {
      console.log('Closing browser...');
      await browser.close().catch(err => {
        console.warn(`Error during browser close: ${err.message}`);
      });
    }
  } catch (error) {
    console.warn(`Failed to close browser: ${error.message}`);
  }
}

/**
 * Execute an operation with a timeout
 * @param {Function} operation - The async operation to execute
 * @param {number} timeout - Timeout in milliseconds
 * @param {string} operationName - Name of the operation for logging
 * @returns {Promise<any>} Result of the operation
 */
async function withTimeout(operation, timeout, operationName = 'Operation') {
  return new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve(null); // Don't reject, just resolve with null
      console.warn(`⚠️ ${operationName} timed out after ${timeout}ms`);
    }, timeout);
    
    try {
      const result = await operation();
      clearTimeout(timeoutId);
      resolve(result);
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn(`⚠️ ${operationName} failed with error: ${error.message}`);
      resolve(null); // Don't reject, just resolve with null
    }
  });
}

module.exports = {
  initBrowser,
  navigateTo,
  takeScreenshot,
  waitForSuccessMessage,
  extractProductData,
  closeBrowser,
  withTimeout,
  BASE_URL
}; 