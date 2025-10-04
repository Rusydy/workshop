# Testing Documentation

This document describes the testing approach and guidelines for the Pustaka Ilmu Bookstore application.

## Overview

The project uses Playwright for end-to-end (E2E) testing to ensure all functionality works correctly across different browsers. The test suite covers cart functionality, navigation, form submissions, and database interactions.

## Test Framework

- **Framework:** Playwright
- **Language:** JavaScript/TypeScript
- **Browsers:** Chromium, Firefox, WebKit (Safari)
- **Test Runner:** Playwright Test Runner

## Setup

### Prerequisites

- Node.js 16+ installed
- PHP 7.4+ with development server
- MySQL/MariaDB with test database

### Installation

1. **Install Playwright**
   ```bash
   npm install @playwright/test
   npx playwright install
   ```

2. **Configure Test Database**
   Ensure your database is set up with sample data:
   ```bash
   php migrate.php db:fresh
   ```

3. **Start Test Server**
   The test configuration automatically starts a PHP development server:
   ```bash
   # This is handled automatically by playwright.config.js
   php -S localhost:8000
   ```

## Test Configuration

The main configuration is in `playwright.config.js`:

```javascript
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['json'], ['list']],

  use: {
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],

  webServer: {
    command: 'php -S localhost:8000',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/homepage.spec.js

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox

# Run with HTML reporter
npx playwright test --reporter=html

# Run in debug mode
npx playwright test --debug

# Run headed (visible browser)
npx playwright test --headed
```

### Test Filtering

```bash
# Run tests matching pattern
npx playwright test --grep "cart functionality"

# Run specific test by title
npx playwright test -g "should add book to cart"

# Run tests in specific directory
npx playwright test tests/cart/

# Skip specific tests
npx playwright test --grep-invert "slow tests"
```

## Test Structure

### Test Files Organization

```
tests/
├── homepage.spec.js           # Homepage functionality tests
├── navigation.spec.js         # Navigation and routing tests
├── books-page.spec.js         # Book catalog page tests
├── cart-functionality.spec.js # Shopping cart tests
├── contact-page.spec.js       # Contact form tests
├── about-page.spec.js         # About page tests
├── api-integration.spec.js    # API endpoint tests
├── responsive-design.spec.js  # Mobile/responsive tests
└── helpers/
    ├── test-helpers.js        # Common test utilities
    └── fixtures.js            # Test data fixtures
```

### Test Categories

#### 1. Page Load Tests
Verify pages load correctly with proper content:

```javascript
test('should load homepage with correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Toko Buku Pustaka Ilmu');
  await expect(page.locator('h1')).toContainText('Temukan Dunia Baru');
});
```

#### 2. Navigation Tests
Test menu navigation and routing:

```javascript
test('should navigate between pages', async ({ page }) => {
  await page.goto('/');
  await page.click('nav a[href="books.php"]');
  await expect(page).toHaveURL(/.*books\.php/);
  await expect(page.locator('h1')).toContainText('Semua Koleksi');
});
```

#### 3. Cart Functionality Tests
Test shopping cart operations:

```javascript
test('should add book to cart and update counter', async ({ page }) => {
  await page.goto('/');

  const initialCount = await page.locator('.cart-badge').textContent() || '0';
  await page.click('.btn-buy').first();

  await page.waitForSelector('.notification');
  const newCount = await page.locator('.cart-badge').textContent();
  expect(parseInt(newCount)).toBe(parseInt(initialCount) + 1);
});
```

#### 4. Form Tests
Test form submissions and validation:

```javascript
test('should submit contact form with valid data', async ({ page }) => {
  await page.goto('/contact.php');

  await page.fill('#name', 'Test User');
  await page.fill('#email', 'test@example.com');
  await page.fill('#message', 'Test message');

  await page.click('button[type="submit"]');

  await expect(page.locator('.alert-success')).toBeVisible();
});
```

#### 5. API Integration Tests
Test AJAX endpoints:

```javascript
test('should make AJAX request to add_to_cart.php', async ({ page }) => {
  const requests = [];
  page.on('request', req => {
    if (req.url().includes('add_to_cart.php')) {
      requests.push(req);
    }
  });

  await page.goto('/');
  await page.click('.btn-buy').first();

  expect(requests.length).toBeGreaterThan(0);
  expect(requests[0].method()).toBe('POST');
});
```

#### 6. Responsive Design Tests
Test mobile compatibility:

```javascript
test('should be responsive on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  await expect(page.locator('.navbar-toggler')).toBeVisible();
  await expect(page.locator('.hero-section')).toBeVisible();
});
```

## Test Data Management

### Database State
Tests use the seeded database data for consistency:

```javascript
test.beforeEach(async ({ page }) => {
  // Tests assume fresh seeded data exists
  // Books: 12 sample books
  // Orders: 5 sample orders with items
});
```

### Test Fixtures
Common test data is stored in `tests/helpers/fixtures.js`:

```javascript
export const testData = {
  validCustomer: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '081234567890',
    address: 'Jl. Test No. 123, Jakarta'
  },

  invalidEmails: [
    'invalid-email',
    'missing@domain',
    '@missing-local.com'
  ],

  sampleBooks: [
    { id: 1, title: 'Judul Buku Fiksi', price: 99000 },
    { id: 2, title: 'Buku Pengembangan Diri', price: 125000 }
  ]
};
```

## Best Practices

### 1. Test Independence
- Each test should be independent and not rely on other tests
- Use `test.beforeEach()` for setup, `test.afterEach()` for cleanup
- Reset application state between tests

### 2. Proper Waiting
```javascript
// ❌ Bad: Arbitrary timeouts
await page.waitForTimeout(2000);

// ✅ Good: Wait for specific conditions
await page.waitForSelector('.cart-badge');
await page.waitForLoadState('networkidle');
await expect(page.locator('.success')).toBeVisible();
```

### 3. Reliable Selectors
```javascript
// ❌ Bad: Brittle selectors
await page.click('div > span.btn');

// ✅ Good: Semantic selectors
await page.click('button[type="submit"]');
await page.click('[data-testid="add-to-cart"]');
await page.getByRole('button', { name: 'Add to Cart' });
```

### 4. Error Handling
```javascript
test('should handle network errors gracefully', async ({ page }) => {
  // Simulate network failure
  await page.route('**/add_to_cart.php', route => route.abort());

  await page.goto('/');
  await page.click('.btn-buy').first();

  // Verify error handling
  await expect(page.locator('.error-message')).toBeVisible();
});
```

### 5. Test Organization
```javascript
test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Adding Items', () => {
    test('should add single item', async ({ page }) => {
      // Test implementation
    });

    test('should add multiple items', async ({ page }) => {
      // Test implementation
    });
  });

  test.describe('Removing Items', () => {
    // Removal tests
  });
});
```

## Debugging Tests

### 1. Debug Mode
```bash
# Run single test in debug mode
npx playwright test tests/cart.spec.js --debug

# Debug specific test
npx playwright test -g "should add to cart" --debug
```

### 2. Screenshots and Videos
```javascript
test('failing test', async ({ page }) => {
  // Take screenshot for debugging
  await page.screenshot({ path: 'debug-screenshot.png' });

  // This will auto-capture on failure due to config
  await expect(page.locator('.non-existent')).toBeVisible();
});
```

### 3. Console Logs
```javascript
test('with console logging', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('/');
  // Browser console logs will appear in test output
});
```

### 4. Trace Viewer
```bash
# Generate trace on failure (automatic in config)
npx playwright show-trace trace.zip

# Or run with trace enabled
npx playwright test --trace on
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: db_stik
        ports:
          - 3306:3306

    steps:
      - uses: actions/checkout@v3

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '7.4'

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Setup database
        run: php migrate.php db:fresh

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Performance Testing

### Load Time Tests
```javascript
test('should load pages within acceptable time', async ({ page }) => {
  const startTime = Date.now();

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000); // 3 seconds max
});
```

### Memory Usage
```javascript
test('should not have memory leaks', async ({ page }) => {
  await page.goto('/');

  // Navigate through multiple pages
  for (let i = 0; i < 10; i++) {
    await page.goto('/books.php');
    await page.goto('/');
  }

  // Check for JavaScript errors
  const errors = [];
  page.on('pageerror', error => errors.push(error));

  expect(errors).toHaveLength(0);
});
```

## Accessibility Testing

### Basic A11y Checks
```javascript
test('should meet accessibility standards', async ({ page }) => {
  await page.goto('/');

  // Check for proper headings hierarchy
  const h1Count = await page.locator('h1').count();
  expect(h1Count).toBe(1);

  // Check for alt text on images
  const images = page.locator('img');
  const imageCount = await images.count();

  for (let i = 0; i < imageCount; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    expect(alt).toBeTruthy();
  }

  // Check form labels
  const inputs = page.locator('input[required]');
  const inputCount = await inputs.count();

  for (let i = 0; i < inputCount; i++) {
    const input = inputs.nth(i);
    const id = await input.getAttribute('id');
    const label = page.locator(`label[for="${id}"]`);
    await expect(label).toBeVisible();
  }
});
```

## Test Maintenance

### Regular Tasks
1. **Update test data** when database schema changes
2. **Review failing tests** and update selectors as UI evolves
3. **Add tests for new features** before deployment
4. **Remove obsolete tests** for removed functionality
5. **Monitor test execution time** and optimize slow tests

### Code Coverage
While Playwright focuses on E2E testing, monitor:
- Page coverage (all pages tested)
- Feature coverage (all user flows tested)
- Browser coverage (cross-browser compatibility)
- Device coverage (responsive design)

### Reporting
Test results are available in multiple formats:
- **HTML Report:** `playwright-report/index.html`
- **JSON Report:** `test-results/results.json`
- **Console Output:** Real-time test execution
- **Screenshots/Videos:** Available for failed tests

## Common Issues and Solutions

### 1. Flaky Tests
```javascript
// Use proper waits instead of timeouts
await page.waitForSelector('.dynamic-content');
await expect(page.locator('.result')).toBeVisible();

// Retry unstable operations
test('flaky operation', async ({ page }) => {
  await test.step('retry flaky action', async () => {
    let attempts = 0;
    while (attempts < 3) {
      try {
        await page.click('.sometimes-fails');
        await expect(page.locator('.success')).toBeVisible();
        break;
      } catch (error) {
        attempts++;
        if (attempts === 3) throw error;
        await page.waitForTimeout(1000);
      }
    }
  });
});
```

### 2. Server Connection Issues
```javascript
// Wait for server to be ready
test.beforeAll(async () => {
  // Ensure server is responding
  const response = await fetch('http://localhost:8000');
  if (!response.ok) {
    throw new Error('Server not ready');
  }
});
```

### 3. Database State Issues
```javascript
// Reset database state if needed
test.beforeEach(async () => {
  // Clear session/cart data
  const { page } = await browser.newContext();
  await page.goto('/clear_cart.php', { method: 'POST' });
});
```

This testing documentation provides comprehensive guidance for maintaining and extending the test suite as the application evolves.
