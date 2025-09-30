# Playwright Testing Setup for Pustaka Ilmu Bookstore

This document provides comprehensive instructions for setting up and running Playwright tests for the Pustaka Ilmu bookstore website.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing New Tests](#writing-new-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before setting up Playwright, ensure you have:

- **Node.js** (version 16 or higher)
- **npm** (usually comes with Node.js)
- A modern web browser (Chrome, Firefox, or Safari)
- Basic understanding of JavaScript and web testing concepts

## Installation

### 1. Install Dependencies

```bash
# Navigate to the project directory
cd workshop

# Install all dependencies including Playwright
npm install

# Install Playwright browsers
npm run install:browsers
```

### 2. Verify Installation

```bash
# Check if Playwright is installed correctly
npx playwright --version
```

## Configuration

The project uses `playwright.config.js` for configuration. Key settings include:

- **Base URL**: `http://localhost:8080`
- **Test Directory**: `./tests`
- **Browsers**: Chrome, Firefox, Safari, and mobile variants
- **Screenshots**: Captured on test failures
- **Videos**: Recorded for failed tests
- **Traces**: Collected for debugging

### Web Server Configuration

The configuration includes an automatic web server setup:
- Starts `http-server` on port 8080
- Serves static files from the project root
- Automatically starts before tests and stops after

## Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug
```

### Running Specific Tests

```bash
# Run a specific test file
npx playwright test homepage.spec.js

# Run tests matching a pattern
npx playwright test --grep "homepage"

# Run tests for a specific browser
npx playwright test --project=chromium
```

### Viewing Test Results

```bash
# Show the last test report
npm run test:report

# Open HTML report in browser
npx playwright show-report
```

## Test Structure

### Test Files Overview

1. **`homepage.spec.js`** - Tests for the main landing page
   - Navigation functionality
   - Hero section display
   - Trending books loading
   - Cart functionality
   - Responsive design

2. **`books-page.spec.js`** - Tests for the books collection page
   - Page structure validation
   - Book display functionality
   - Search and filter features
   - Add to cart operations
   - Responsive layouts

3. **`cross-browser.spec.js`** - Cross-browser compatibility tests
   - Browser-specific functionality
   - CSS rendering consistency
   - JavaScript behavior
   - Performance benchmarks

4. **`api-integration.spec.js`** - API and data integration tests
   - Books.json loading
   - HTMX cart integration
   - Error handling
   - Network performance

### Test Organization

```
tests/
├── homepage.spec.js           # Homepage functionality
├── books-page.spec.js         # Books page features
├── cross-browser.spec.js      # Browser compatibility
└── api-integration.spec.js    # API and data tests
```

## Writing New Tests

### Basic Test Structure

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something specific', async ({ page }) => {
    // Test implementation
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Best Practices

1. **Use Descriptive Test Names**
   ```javascript
   test('should display cart counter when items are added', async ({ page }) => {
     // Test implementation
   });
   ```

2. **Wait for Elements Properly**
   ```javascript
   // Good: Wait for element to be visible
   await expect(page.locator('.book-card')).toBeVisible();
   
   // Better: Wait for specific state
   await page.waitForFunction(() => {
     return document.querySelectorAll('.book-card').length > 0;
   });
   ```

3. **Use Page Object Pattern for Complex Pages**
   ```javascript
   class BookstorePage {
     constructor(page) {
       this.page = page;
       this.cartIcon = page.locator('.fa-shopping-cart');
       this.booksGrid = page.locator('.grid');
     }

     async addFirstBookToCart() {
       const firstCard = this.booksGrid.locator('.book-card').first();
       await firstCard.hover();
       await firstCard.locator('.btn-buy').click();
     }
   }
   ```

4. **Handle Async Operations**
   ```javascript
   // Wait for books to load
   await page.waitForFunction(() => {
     const loadingElement = document.querySelector('[x-show="loading"]');
     return !loadingElement || loadingElement.style.display === 'none';
   });
   ```

### Common Selectors and Patterns

```javascript
// Navigation elements
const homeLink = page.locator('nav a[href="index.html"]');
const booksLink = page.locator('nav a[href="books.html"]');

// Book-related elements
const bookCards = page.locator('.book-card');
const buyButtons = page.locator('.btn-buy');
const cartCounter = page.locator('[x-text="cartCount"]');

// Loading states
const loadingIndicator = page.locator('[x-show="loading"]');
const notification = page.locator('[x-show="showNotification"]');
```

## Test Data Management

### Using Mock Data

```javascript
// Mock API responses
await page.route('**/books.json', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        price: 'Rp 50.000',
        image: 'test.jpg',
        trending: true
      }
    ])
  });
});
```

### Environment-Specific Configuration

Create different configurations for different environments:

```javascript
// playwright.config.local.js
module.exports = {
  ...require('./playwright.config.js'),
  use: {
    baseURL: 'http://localhost:3000',
  },
};
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Running Tests in Docker

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
CMD ["npm", "test"]
```

## Performance Testing

### Measuring Load Times

```javascript
test('should load within acceptable time', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/');
  await expect(page.locator('header')).toBeVisible();
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(3000); // 3 seconds
});
```

### Network Conditions

```javascript
// Simulate slow 3G
await page.route('**/*', async route => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const response = await route.fetch();
  route.fulfill({ response });
});
```

## Debugging and Troubleshooting

### Common Issues and Solutions

1. **Tests Timeout**
   ```bash
   # Increase timeout
   npx playwright test --timeout=60000
   ```

2. **Element Not Found**
   ```javascript
   // Use more specific selectors
   await page.locator('[data-testid="book-card"]').first().waitFor();
   ```

3. **Flaky Tests**
   ```javascript
   // Add proper waits
   await expect(page.locator('.notification')).toBeVisible();
   await expect(page.locator('.notification')).not.toBeVisible();
   ```

### Debug Commands

```bash
# Run with debug output
DEBUG=pw:api npm test

# Run single test in debug mode
npx playwright test --debug homepage.spec.js

# Generate test code interactively
npx playwright codegen localhost:8080
```

### Screenshots and Videos

```javascript
// Take screenshot manually
await page.screenshot({ path: 'debug-screenshot.png' });

// Take screenshot of specific element
await page.locator('.book-card').screenshot({ path: 'book-card.png' });
```

## Advanced Features

### Custom Fixtures

```javascript
// fixtures/bookstore.js
const { test: base } = require('@playwright/test');

const test = base.extend({
  bookstorePage: async ({ page }, use) => {
    const bookstorePage = new BookstorePage(page);
    await use(bookstorePage);
  },
});

module.exports = { test };
```

### Visual Regression Testing

```javascript
test('should match visual baseline', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

### API Testing

```javascript
test('should handle API responses', async ({ request }) => {
  const response = await request.get('/api/books');
  expect(response.status()).toBe(200);
  
  const books = await response.json();
  expect(books).toHaveLength({ min: 1 });
});
```

## Maintenance and Best Practices

### Regular Maintenance Tasks

1. **Update Dependencies**
   ```bash
   npm update @playwright/test
   npm run install:browsers
   ```

2. **Clean Test Artifacts**
   ```bash
   rm -rf test-results/ playwright-report/
   ```

3. **Review Test Coverage**
   - Ensure all user journeys are covered
   - Add tests for new features
   - Remove obsolete tests

### Code Quality

1. **Use ESLint for Test Files**
   ```json
   {
     "extends": ["@playwright/eslint-plugin/recommended"]
   }
   ```

2. **Follow Naming Conventions**
   - Test files: `*.spec.js`
   - Page objects: `*.page.js`
   - Utilities: `*.helper.js`

3. **Document Complex Test Logic**
   ```javascript
   test('complex user journey', async ({ page }) => {
     // Step 1: Navigate to books page
     await page.goto('/books.html');
     
     // Step 2: Filter by category
     // ... implementation
   });
   ```

## Resources and References

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)
- [Web Accessibility Testing](https://playwright.dev/docs/accessibility-testing)

## Support and Contributing

For questions or issues with the test suite:

1. Check existing test results and logs
2. Review this documentation
3. Create an issue with detailed reproduction steps
4. Follow the project's contributing guidelines

Remember to run tests locally before submitting changes and ensure all tests pass in the target browsers.