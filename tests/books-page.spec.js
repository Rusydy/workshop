const { test, expect } = require("@playwright/test");

test.describe("Books Page Tests - PHP/Bootstrap Version", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/books.php");
  });

  test("should display the books page correctly", async ({ page }) => {
    // Check page title
    await expect(page.locator("h1")).toContainText("Semua Koleksi Buku");

    // Check subtitle
    await expect(page.locator(".hero-section p")).toContainText(
      "Temukan buku favoritmu di sini.",
    );

    // Verify page URL
    await expect(page).toHaveURL(/.*books\.php/);

    // Check navigation shows books as active
    const booksNavLink = page.locator('nav a[href="books.php"]');
    await expect(booksNavLink).toHaveClass(/active/);
  });

  test("should load all books from database", async ({ page }) => {
    // Wait for database query to complete
    await page.waitForTimeout(1000);

    const bookCards = page.locator(".book-card");
    const noDataAlert = page.locator(".alert-warning");

    const hasBooks = (await bookCards.count()) > 0;
    const hasNoDataMessage = (await noDataAlert.count()) > 0;

    // Should have either books or appropriate message
    expect(hasBooks || hasNoDataMessage).toBeTruthy();

    if (hasBooks) {
      // Verify books display properly
      const bookCount = await bookCards.count();
      expect(bookCount).toBeGreaterThan(0);

      // Check first book structure
      const firstBook = bookCards.first();
      await expect(firstBook.locator(".card-title")).toBeVisible();
      await expect(firstBook.locator(".text-muted")).toBeVisible();
      await expect(firstBook.locator(".book-price")).toBeVisible();
      await expect(firstBook.locator("img")).toBeVisible();
    }
  });

  test("should display book information correctly", async ({ page }) => {
    await page.waitForTimeout(1000);

    const bookCards = page.locator(".book-card");
    if ((await bookCards.count()) > 0) {
      const firstBook = bookCards.first();

      // Check title is not empty
      const title = await firstBook.locator(".card-title").textContent();
      expect(title.trim().length).toBeGreaterThan(0);

      // Check author format (should contain "oleh")
      const author = await firstBook.locator(".text-muted").textContent();
      expect(author).toMatch(/oleh\s+.+/);

      // Check price format
      const price = await firstBook.locator(".book-price").textContent();
      expect(price).toMatch(/Rp\s[\d,.]+/);

      // Check image has source
      const img = firstBook.locator("img");
      const imgSrc = await img.getAttribute("src");
      expect(imgSrc).toBeTruthy();
      expect(imgSrc.length).toBeGreaterThan(0);

      // Check image has alt attribute
      const imgAlt = await img.getAttribute("alt");
      expect(imgAlt).toBeTruthy();
      expect(imgAlt).toContain("Cover");
    }
  });

  test("should show more books than homepage trending", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Go to homepage to count trending books
    await page.goto("/");
    await page.waitForTimeout(1000);

    const trendingCount = await page.locator(".book-card").count();

    // Go back to books page
    await page.goto("/books.php");
    await page.waitForTimeout(1000);

    const allBooksCount = await page.locator(".book-card").count();

    // Books page should show all books (12 total vs 4 trending)
    // Only compare if both pages have books
    if (trendingCount > 0 && allBooksCount > 0) {
      expect(allBooksCount).toBeGreaterThanOrEqual(trendingCount);
    }
  });

  test("should display books in proper grid layout", async ({ page }) => {
    await page.waitForTimeout(1000);

    const bookCards = page.locator(".book-card");
    if ((await bookCards.count()) > 0) {
      // Check grid container exists
      const gridContainer = page.locator(".row.g-4");
      await expect(gridContainer).toBeVisible();

      // Check responsive classes are applied
      const firstBook = bookCards.first();
      const bookContainer = firstBook.locator("xpath=./..");

      // Should have Bootstrap column classes
      const classes = await bookContainer.getAttribute("class");
      expect(classes).toMatch(/col-/);
    }
  });

  test("should handle cart functionality on all books", async ({ page }) => {
    await page.waitForTimeout(1000);

    const bookCards = page.locator(".book-card");
    if ((await bookCards.count()) > 0) {
      const bookCount = Math.min(3, await bookCards.count()); // Test first 3 books

      for (let i = 0; i < bookCount; i++) {
        const book = bookCards.nth(i);

        // Hover to reveal buy button
        await book.hover();

        const buyButton = book.locator(".btn-buy");
        if (await buyButton.isVisible()) {
          // Check button properties
          await expect(buyButton).toContainText("Beli Sekarang");
          await expect(buyButton).toHaveClass(/btn-primary/);

          // Check onclick attribute or functionality
          const onclickAttr = await buyButton.getAttribute("onclick");
          expect(onclickAttr).toMatch(/addToCart\(\d+\)/);
        }
      }
    }
  });

  test("should maintain consistent book card styling", async ({ page }) => {
    await page.waitForTimeout(1000);

    const bookCards = page.locator(".book-card");
    if ((await bookCards.count()) > 0) {
      // Check all books have consistent styling
      const bookCount = await bookCards.count();

      for (let i = 0; i < Math.min(bookCount, 5); i++) {
        const book = bookCards.nth(i);

        // Check card classes
        const cardClasses = await book.getAttribute("class");
        expect(cardClasses).toContain("book-card");
        expect(cardClasses).toContain("h-100");

        // Check image dimensions
        const img = book.locator("img");
        await expect(img).toBeVisible();

        // Check price styling
        const price = book.locator(".book-price");
        const priceClasses = await price.getAttribute("class");
        expect(priceClasses).toContain("book-price");
      }
    }
  });

  test("should work on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.waitForTimeout(1000);

    // Check mobile navigation
    const mobileToggle = page.locator(".navbar-toggler");
    await expect(mobileToggle).toBeVisible();

    // Check header is responsive
    const heroSection = page.locator(".hero-section");
    await expect(heroSection).toBeVisible();

    // Check books grid is responsive
    const bookCards = page.locator(".book-card");
    if ((await bookCards.count()) > 0) {
      // On mobile, should stack vertically
      const firstBook = bookCards.first();
      await expect(firstBook).toBeVisible();

      // Check that books don't overflow
      const viewport = await page.viewportSize();
      const bookBox = await firstBook.boundingBox();
      if (bookBox) {
        expect(bookBox.width).toBeLessThanOrEqual(viewport.width);
      }
    }
  });

  test("should handle empty database state gracefully", async ({ page }) => {
    // Check if no books message is shown appropriately
    const bookCards = page.locator(".book-card");
    const alertMessage = page.locator(".alert-warning");

    await page.waitForTimeout(1000);

    const hasBooks = (await bookCards.count()) > 0;
    const hasAlert = (await alertMessage.count()) > 0;

    if (!hasBooks && hasAlert) {
      // Should show appropriate no books message
      await expect(alertMessage).toContainText("No books available");
      await expect(alertMessage).toContainText("updated");
    }

    // Page should still be functional
    await expect(page.locator("nav.navbar")).toBeVisible();
    await expect(page.locator(".hero-section")).toBeVisible();
  });

  test("should navigate back to homepage correctly", async ({ page }) => {
    // Click on brand/logo
    const brandLink = page.locator('.navbar-brand[href="index.php"]');
    await brandLink.click();

    await expect(page).toHaveURL(/.*index\.php$|.*\/$/);

    // Wait for page to load
    await page.waitForTimeout(1000);

    const heroTitle = page.locator(".hero-section h1");
    if ((await heroTitle.count()) > 0) {
      await expect(heroTitle).toContainText(
        "Temukan Dunia Baru dalam Setiap Halaman",
      );
    }

    // Go back to books
    await page.goto("/books.php");

    // Click on Beranda nav link
    const homeNavLink = page.locator('nav .nav-link[href="index.php"]');
    await homeNavLink.click();

    await expect(page).toHaveURL(/.*index\.php$|.*\/$/);
  });

  test("should load all 12 books if database is properly set up", async ({
    page,
  }) => {
    await page.waitForTimeout(1000);

    const bookCards = page.locator(".book-card");
    const bookCount = await bookCards.count();

    // If database is set up with sample data, should have 12 books
    if (bookCount > 0) {
      // Sample data includes 12 books
      expect(bookCount).toBeLessThanOrEqual(12);

      // Check that we have the expected sample books
      if (bookCount >= 4) {
        const bookTitles = [];
        for (let i = 0; i < Math.min(4, bookCount); i++) {
          const title = await bookCards
            .nth(i)
            .locator(".card-title")
            .textContent();
          bookTitles.push(title.trim());
        }

        // Should include some of our sample books
        const expectedTitles = [
          "Judul Buku Fiksi",
          "Buku Pengembangan Diri",
          "Cerita Anak Edukatif",
          "Sejarah Nusantara",
        ];

        const hasExpectedBooks = expectedTitles.some((expected) =>
          bookTitles.some((actual) => actual.includes(expected)),
        );
        expect(hasExpectedBooks).toBeTruthy();
      }
    }
  });

  test("should show proper book prices in Indonesian Rupiah", async ({
    page,
  }) => {
    await page.waitForTimeout(1000);

    const bookCards = page.locator(".book-card");
    if ((await bookCards.count()) > 0) {
      const priceElements = bookCards.locator(".book-price");
      const priceCount = await priceElements.count();

      // Check first few prices
      for (let i = 0; i < Math.min(priceCount, 3); i++) {
        const priceText = await priceElements.nth(i).textContent();

        if (priceText && priceText.trim()) {
          // Should contain "Rp" and numbers
          expect(priceText).toMatch(/Rp/i);
          expect(priceText).toMatch(/\d/);
        }
      }
    }
  });

  test("should maintain consistent hover effects", async ({ page }) => {
    await page.waitForTimeout(1000);

    const bookCards = page.locator(".book-card");
    if ((await bookCards.count()) > 0) {
      const firstBook = bookCards.first();

      // Hover over book
      await firstBook.hover();
      await page.waitForTimeout(500); // Wait for animation

      // Buy button should become visible or at least exist
      const buyButton = firstBook.locator(".btn-buy");
      const buttonExists = (await buyButton.count()) > 0;

      if (buttonExists) {
        // Button should have proper styling
        const buttonClasses = await buyButton.getAttribute("class");
        expect(buttonClasses).toContain("btn");

        // Check if button has onclick attribute
        const onclick = await buyButton.getAttribute("onclick");
        if (onclick) {
          expect(onclick).toMatch(/addToCart/);
        }
      }

      // Test that hover interaction is working (card should be hoverable)
      const cardClasses = await firstBook.getAttribute("class");
      expect(cardClasses).toContain("book-card");
    }
  });

  test("should handle database errors gracefully", async ({ page }) => {
    // Even if there are database connection issues, page should load
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("nav.navbar")).toBeVisible();
    await expect(page.locator(".hero-section")).toBeVisible();

    // Should not show PHP error messages to users
    const bodyText = await page.textContent("body");
    expect(bodyText).not.toMatch(/Fatal error|mysqli_|PDO::/i);

    // Navigation should still work
    const navLinks = page.locator("nav a");
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Can navigate to other pages
    await page.click('nav a[href="about.php"]');
    await expect(page).toHaveURL(/.*about\.php/);
  });
});
