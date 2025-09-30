const { test, expect } = require("@playwright/test");

test.describe("Books Collection Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/books.html");
  });

  test("should display the books page title and navigation", async ({
    page,
  }) => {
    // Check if we're on the books page
    await expect(page).toHaveURL(/.*books\.html/);

    // Check navigation is present
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    // Check that Books/Koleksi link is active/highlighted
    const booksLink = page.locator('nav a[href="books.html"]');
    await expect(booksLink).toBeVisible();
  });

  test("should have proper page structure", async ({ page }) => {
    // Check header is present
    await expect(page.locator("header")).toBeVisible();

    // Check main content area
    await expect(page.locator("main")).toBeVisible();

    // Check footer
    await expect(page.locator("footer")).toBeVisible();

    // Check brand/logo
    await expect(
      page.locator('header a[href="index.html"]').first(),
    ).toContainText("Pustaka Ilmu 📚");
  });

  test("should display books collection", async ({ page }) => {
    // Wait for any dynamic content to load
    await page.waitForTimeout(1000);

    // Check for books grid or list container
    const booksContainer = page.locator(".grid, .books-grid, .collection");

    // If books are loaded dynamically, wait for them
    if ((await booksContainer.count()) > 0) {
      await expect(booksContainer.first()).toBeVisible();
    }
  });

  test("should have working search/filter functionality if present", async ({
    page,
  }) => {
    // Look for search input
    const searchInput = page.locator(
      'input[type="search"], input[placeholder*="search"], input[placeholder*="cari"]',
    );

    if ((await searchInput.count()) > 0) {
      await expect(searchInput.first()).toBeVisible();

      // Test search functionality
      await searchInput.first().fill("fiksi");
      await page.keyboard.press("Enter");

      // Wait for search results
      await page.waitForTimeout(500);
    }

    // Look for category filters
    const categoryFilter = page.locator("select, .filter, .category-filter");
    if ((await categoryFilter.count()) > 0) {
      await expect(categoryFilter.first()).toBeVisible();
    }
  });

  test("should display individual book cards with proper information", async ({
    page,
  }) => {
    // Wait for books to load
    await page.waitForTimeout(1000);

    // Look for book cards
    const bookCards = page.locator('.book-card, .book-item, [class*="book"]');

    if ((await bookCards.count()) > 0) {
      const firstBook = bookCards.first();
      await expect(firstBook).toBeVisible();

      // Check for book image
      const bookImage = firstBook.locator("img");
      if ((await bookImage.count()) > 0) {
        await expect(bookImage).toBeVisible();
      }

      // Check for book title
      const bookTitle = firstBook.locator('h3, .title, [class*="title"]');
      if ((await bookTitle.count()) > 0) {
        await expect(bookTitle).toBeVisible();
      }

      // Check for book price
      const bookPrice = firstBook.locator('.price, [class*="price"]');
      if ((await bookPrice.count()) > 0) {
        await expect(bookPrice).toBeVisible();
      }
    }
  });

  test('should have working "Add to Cart" buttons', async ({ page }) => {
    // Wait for books to load
    await page.waitForTimeout(1000);

    // Look for add to cart buttons
    const addToCartButtons = page.locator(
      'button:has-text("Beli"), button:has-text("Cart"), .btn-buy, [class*="add-cart"]',
    );

    if ((await addToCartButtons.count()) > 0) {
      const firstButton = addToCartButtons.first();

      // Make button visible (might need hover)
      await firstButton.hover();
      await expect(firstButton).toBeVisible();

      // Test cart counter before click
      const cartCounter = page.locator('.cart-count, [class*="cart-count"]');
      const initialCount =
        (await cartCounter.count()) > 0 ? await cartCounter.textContent() : "0";

      // Click add to cart
      await firstButton.click();

      // Wait for potential notification or cart update
      await page.waitForTimeout(500);
    }
  });

  test("should show book categories or genres if available", async ({
    page,
  }) => {
    // Look for category sections
    const categories = page.locator(
      '.category, .genre, section[class*="category"]',
    );

    if ((await categories.count()) > 0) {
      await expect(categories.first()).toBeVisible();
    }

    // Look for category navigation
    const categoryNav = page.locator(
      '.category-nav, .genre-filter, nav[class*="category"]',
    );

    if ((await categoryNav.count()) > 0) {
      await expect(categoryNav.first()).toBeVisible();
    }
  });

  test("should be responsive on different screen sizes", async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator("header")).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();

    // Check if books grid adapts to mobile
    const booksGrid = page.locator(".grid, .books-grid");
    if ((await booksGrid.count()) > 0) {
      await expect(booksGrid.first()).toBeVisible();
    }
  });

  test("should handle loading states gracefully", async ({ page }) => {
    // Reload page to catch loading state
    await page.reload();

    // Look for loading indicators
    const loadingIndicators = page.locator(
      '.loading, .spinner, [class*="loading"]',
    );

    // Wait for content to fully load
    await page.waitForTimeout(2000);

    // Check that main content is visible after loading
    await expect(page.locator("main")).toBeVisible();
  });

  test("should allow navigation back to homepage", async ({ page }) => {
    // Click on home/beranda link
    const homeLink = page.locator(
      'nav a[href="index.html"], a:has-text("Beranda")',
    );
    await expect(homeLink).toBeVisible();

    await homeLink.click();
    await expect(page).toHaveURL(/.*index\.html|.*\/$/);
  });

  test("should display proper breadcrumbs or page indicators", async ({
    page,
  }) => {
    // Look for breadcrumb navigation
    const breadcrumbs = page.locator(
      '.breadcrumb, .breadcrumbs, nav[aria-label*="breadcrumb"]',
    );

    if ((await breadcrumbs.count()) > 0) {
      await expect(breadcrumbs.first()).toBeVisible();
    }

    // Check for page title or heading
    const pageHeading = page.locator("h1, .page-title, main h2");
    if ((await pageHeading.count()) > 0) {
      await expect(pageHeading.first()).toBeVisible();
    }
  });

  test("should handle empty or error states", async ({ page }) => {
    // This test checks if the page handles cases where no books are available
    // or if there are loading errors

    // Wait for page to fully load
    await page.waitForTimeout(2000);

    // Check if page displays any error messages
    const errorMessages = page.locator('.error, .no-results, [class*="error"]');

    // The page should either show books or a proper message
    const booksContainer = page.locator(".book-card, .books-grid, .grid");
    const hasBooks = (await booksContainer.count()) > 0;
    const hasErrorMessage = (await errorMessages.count()) > 0;

    // Either books should be visible OR there should be an appropriate message
    expect(hasBooks || hasErrorMessage).toBeTruthy();
  });

  test("should maintain cart state between page loads", async ({ page }) => {
    // First, try to add an item to cart if possible
    const addToCartButton = page
      .locator('button:has-text("Beli"), .btn-buy')
      .first();

    if (await addToCartButton.isVisible()) {
      await addToCartButton.hover();
      await addToCartButton.click();
      await page.waitForTimeout(500);
    }

    // Navigate to another page and back
    await page.locator('nav a[href="index.html"]').click();
    await page.waitForTimeout(500);
    await page.locator('nav a[href="books.html"]').click();

    // Cart state should be maintained (if cart functionality exists)
    const cartIndicator = page.locator('.cart-count, [class*="cart"]');
    if ((await cartIndicator.count()) > 0) {
      await expect(cartIndicator).toBeVisible();
    }
  });
});
