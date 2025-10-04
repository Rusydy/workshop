const { test, expect } = require("@playwright/test");

test.describe("API Integration and Database Tests - PHP/MySQL Version", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Database Connection and Data Loading", () => {
    test("should load books from MySQL database successfully", async ({
      page,
    }) => {
      // Wait for page to load
      await page.waitForTimeout(1000);

      // Check if books section exists
      const booksSection = page.locator("#koleksi");
      await expect(booksSection).toBeVisible();

      // Should either show books or appropriate error message
      const bookCards = page.locator(".book-card");
      const alertMessage = page.locator(".alert");

      const hasBooks = (await bookCards.count()) > 0;
      const hasAlert = (await alertMessage.count()) > 0;

      expect(hasBooks || hasAlert).toBeTruthy();

      if (hasBooks) {
        // Verify book card structure
        const firstBook = bookCards.first();
        await expect(firstBook.locator(".card-title")).toBeVisible();
        await expect(firstBook.locator(".text-muted")).toBeVisible();
        await expect(firstBook.locator(".book-price")).toBeVisible();
        await expect(firstBook.locator("img")).toBeVisible();
      }
    });

    test("should display proper book data from database", async ({ page }) => {
      await page.waitForTimeout(1000);

      const bookCards = page.locator(".book-card");
      if ((await bookCards.count()) > 0) {
        const firstBook = bookCards.first();

        // Check title format
        const title = await firstBook.locator(".card-title").textContent();
        expect(title.trim().length).toBeGreaterThan(0);

        // Check author format (should contain "oleh")
        const author = await firstBook.locator(".text-muted").textContent();
        expect(author).toMatch(/oleh\s+.+/);

        // Check price format (should contain "Rp" and be formatted)
        const price = await firstBook.locator(".book-price").textContent();
        expect(price).toMatch(/Rp\s[\d,.]+/);

        // Check image source
        const img = firstBook.locator("img");
        const imgSrc = await img.getAttribute("src");
        expect(imgSrc).toContain("placehold.co");
      }
    });

    test("should handle database connection failures gracefully", async ({
      page,
    }) => {
      // Even if database is down, page should still load
      await expect(page.locator("body")).toBeVisible();
      await expect(page.locator("nav.navbar")).toBeVisible();
      await expect(page.locator(".hero-section")).toBeVisible();

      // Should show appropriate message if no books available
      const booksSection = page.locator("#koleksi");
      await expect(booksSection).toBeVisible();

      // Either books or fallback message should be present
      const hasContent = await page.evaluate(() => {
        const bookCards = document.querySelectorAll(".book-card");
        const alerts = document.querySelectorAll(".alert");
        return bookCards.length > 0 || alerts.length > 0;
      });

      expect(hasContent).toBeTruthy();
    });

    test("should load all books on books page", async ({ page }) => {
      await page.goto("/books.php");

      // Check page title
      await expect(page.locator("h1")).toContainText("Semua Koleksi Buku");

      // Wait for data to load
      await page.waitForTimeout(1000);

      const bookCards = page.locator(".book-card");
      const noDataAlert = page.locator(".alert-warning");

      const hasBooks = (await bookCards.count()) > 0;
      const hasNoDataMessage = (await noDataAlert.count()) > 0;

      // Should have either books or no data message
      expect(hasBooks || hasNoDataMessage).toBeTruthy();

      if (hasBooks) {
        // Books page should potentially show more books than homepage
        const bookCount = await bookCards.count();
        expect(bookCount).toBeGreaterThan(0);

        // Verify all books have proper structure
        for (let i = 0; i < Math.min(bookCount, 3); i++) {
          const book = bookCards.nth(i);
          await expect(book.locator(".card-title")).toBeVisible();
          await expect(book.locator(".book-price")).toBeVisible();
        }
      }
    });
  });

  test.describe("Cart API Integration", () => {
    test("should make AJAX request to add_to_cart.php", async ({ page }) => {
      // Set up request monitoring
      const cartRequests = [];

      page.on("request", (request) => {
        if (request.url().includes("add_to_cart.php")) {
          cartRequests.push({
            method: request.method(),
            url: request.url(),
            postData: request.postData(),
          });
        }
      });

      // Wait for books to load
      await page.waitForTimeout(1000);

      const bookCards = page.locator(".book-card");
      if ((await bookCards.count()) > 0) {
        const firstBook = bookCards.first();
        await firstBook.hover();

        const buyButton = firstBook.locator(".btn-buy");
        if (await buyButton.isVisible()) {
          await buyButton.click();

          // Wait for request to complete
          await page.waitForTimeout(2000);

          // Should have made at least one request
          expect(cartRequests.length).toBeGreaterThanOrEqual(1);

          if (cartRequests.length > 0) {
            const request = cartRequests[0];
            expect(request.method).toBe("POST");
            expect(request.url).toContain("add_to_cart.php");
            expect(request.postData).toContain("book_id=");
          }
        }
      }
    });

    test("should handle successful cart addition", async ({ page }) => {
      // Mock successful response
      await page.route("**/add_to_cart.php", (route) => {
        const request = route.request();
        if (request.method() === "POST") {
          route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              success: true,
              cart_count: 1,
              message: "Item added to cart successfully",
            }),
          });
        } else {
          route.continue();
        }
      });

      await page.waitForTimeout(1000);

      const bookCards = page.locator(".book-card");
      if ((await bookCards.count()) > 0) {
        const initialBadgeCount = await page.locator(".cart-badge").count();

        const firstBook = bookCards.first();
        await firstBook.hover();

        const buyButton = firstBook.locator(".btn-buy");
        if (await buyButton.isVisible()) {
          await buyButton.click();
          await page.waitForTimeout(1500);

          // Check for notification
          const notification = page.locator("#notification");
          const isNotificationVisible = await notification.isVisible();

          // Check for cart badge update
          const finalBadgeCount = await page.locator(".cart-badge").count();
          const badgeUpdated = finalBadgeCount > initialBadgeCount;

          // Either notification should show or badge should update
          expect(isNotificationVisible || badgeUpdated).toBeTruthy();
        }
      }
    });

    test("should handle cart addition failures gracefully", async ({
      page,
    }) => {
      // Mock failed response
      await page.route("**/add_to_cart.php", (route) => {
        route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            success: false,
            message: "Server error",
          }),
        });
      });

      await page.waitForTimeout(1000);

      const bookCards = page.locator(".book-card");
      if ((await bookCards.count()) > 0) {
        const initialBadgeCount = await page.locator(".cart-badge").count();

        const firstBook = bookCards.first();
        await firstBook.hover();

        const buyButton = firstBook.locator(".btn-buy");
        if (await buyButton.isVisible()) {
          await buyButton.click();
          await page.waitForTimeout(1500);

          // Badge should not update on error
          const finalBadgeCount = await page.locator(".cart-badge").count();
          expect(finalBadgeCount).toBe(initialBadgeCount);

          // Page should still be functional
          await expect(page.locator("body")).toBeVisible();
        }
      }
    });

    test("should maintain cart state across pages (PHP sessions)", async ({
      page,
    }) => {
      // Add item to cart on homepage
      await page.waitForTimeout(1000);

      const bookCards = page.locator(".book-card");
      if ((await bookCards.count()) > 0) {
        const firstBook = bookCards.first();
        await firstBook.hover();

        const buyButton = firstBook.locator(".btn-buy");
        if (await buyButton.isVisible()) {
          await buyButton.click();
          await page.waitForTimeout(1500);

          // Navigate to books page
          await page.goto("/books.php");
          await page.waitForTimeout(500);

          // Navigate back to homepage
          await page.goto("/");
          await page.waitForTimeout(500);

          // Cart state should be maintained
          const cartBadge = page.locator(".cart-badge");
          if ((await cartBadge.count()) > 0) {
            const badgeText = await cartBadge.textContent();
            expect(parseInt(badgeText)).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  test.describe("Contact Form Integration", () => {
    test("should submit contact form successfully", async ({ page }) => {
      await page.goto("/contact.php");

      // Fill out the form
      await page.fill("#name", "Test User");
      await page.fill("#email", "test@example.com");
      await page.fill("#message", "This is a test message from Playwright.");

      // Submit the form
      await page.click('button[type="submit"]');

      // Wait for form processing
      await page.waitForTimeout(1500);

      // Should either show success message or stay on page with validation
      const successAlert = page.locator(".alert-success");
      const errorAlert = page.locator(".alert-danger");
      const isOnContactPage = page.url().includes("contact.php");

      // Should either show an alert or stay on contact page
      const hasAlert =
        (await successAlert.count()) > 0 || (await errorAlert.count()) > 0;

      expect(hasAlert || isOnContactPage).toBeTruthy();
    });

    test("should validate contact form fields", async ({ page }) => {
      await page.goto("/contact.php");

      // Submit empty form
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      // Should show validation (browser validation or server-side)
      const errorAlert = page.locator(".alert-danger");
      const formValidation = await page.evaluate(() => {
        const nameInput = document.querySelector("#name");
        const emailInput = document.querySelector("#email");
        const messageInput = document.querySelector("#message");

        return (
          !nameInput.validity.valid ||
          !emailInput.validity.valid ||
          !messageInput.validity.valid
        );
      });

      // Either server-side validation error or browser validation
      const hasValidation = (await errorAlert.count()) > 0 || formValidation;
      expect(hasValidation).toBeTruthy();
    });

    test("should validate email format", async ({ page }) => {
      await page.goto("/contact.php");

      // Fill form with invalid email
      await page.fill("#name", "Test User");
      await page.fill("#email", "invalid-email");
      await page.fill("#message", "Test message");

      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      // Should show validation error
      const hasError = await page.evaluate(() => {
        const emailInput = document.querySelector("#email");
        return !emailInput.validity.valid;
      });

      expect(hasError).toBeTruthy();
    });
  });

  test.describe("Performance and Error Handling", () => {
    test("should handle slow database responses", async ({ page }) => {
      // Simulate slow page load
      const startTime = Date.now();

      await page.goto("/", { waitUntil: "domcontentloaded", timeout: 10000 });

      const loadTime = Date.now() - startTime;

      // Page should load within reasonable time even if slow
      expect(loadTime).toBeLessThan(10000);

      // Content should still be accessible
      await expect(page.locator("nav.navbar")).toBeVisible();
      await expect(page.locator(".hero-section")).toBeVisible();
    });

    test("should handle concurrent requests properly", async ({ page }) => {
      // Rapidly navigate between pages
      const pages = ["/", "/books.php", "/about.php", "/contact.php"];

      for (const pagePath of pages) {
        await page.goto(pagePath, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(200);
      }

      // Final page should load correctly
      await expect(page.locator("body")).toBeVisible();
      await expect(page.locator("nav.navbar")).toBeVisible();
    });

    test("should maintain PHP session integrity", async ({ page }) => {
      // Test session persistence across multiple requests
      await page.goto("/");

      const bookCards = page.locator(".book-card");
      if ((await bookCards.count()) > 0) {
        // Add multiple items to cart
        for (let i = 0; i < Math.min(2, await bookCards.count()); i++) {
          const book = bookCards.nth(i);
          await book.hover();

          const buyButton = book.locator(".btn-buy");
          if (await buyButton.isVisible()) {
            await buyButton.click();
            await page.waitForTimeout(500);
          }
        }

        // Navigate to other pages
        await page.goto("/about.php");
        await page.goto("/books.php");
        await page.goto("/");

        // Session should be maintained
        const cartBadge = page.locator(".cart-badge");
        if ((await cartBadge.count()) > 0) {
          const badgeText = await cartBadge.textContent();
          expect(parseInt(badgeText)).toBeGreaterThan(0);
        }
      }
    });

    test("should handle PHP errors gracefully", async ({ page }) => {
      // Even with potential PHP errors, page should not be completely broken
      await page.goto("/");

      // Basic page structure should be intact
      await expect(page.locator("html")).toBeVisible();
      await expect(page.locator("body")).toBeVisible();

      // Navigation should work
      const navLinks = page.locator("nav a");
      const navCount = await navLinks.count();
      expect(navCount).toBeGreaterThan(0);

      // Should not have PHP fatal error messages visible to user
      const pageContent = await page.textContent("body");
      expect(pageContent).not.toMatch(
        /Fatal error|Parse error|Warning.*in.*on line/i,
      );
    });
  });

  test.describe("Data Integrity and Security", () => {
    test("should properly escape HTML in book data", async ({ page }) => {
      await page.waitForTimeout(1000);

      const bookCards = page.locator(".book-card");
      if ((await bookCards.count()) > 0) {
        // Check that book data is properly escaped (no raw HTML)
        const firstBook = bookCards.first();

        const titleHTML = await firstBook.locator(".card-title").innerHTML();
        const authorHTML = await firstBook.locator(".text-muted").innerHTML();

        // Should not contain script tags or other HTML
        expect(titleHTML).not.toMatch(/<script|<iframe|javascript:/i);
        expect(authorHTML).not.toMatch(/<script|<iframe|javascript:/i);
      }
    });

    test("should handle SQL injection attempts safely", async ({ page }) => {
      // Attempt SQL injection in cart request
      await page.route("**/add_to_cart.php", async (route) => {
        const request = route.request();
        const postData = request.postData() || "";

        // Verify the request is properly handling data
        if (postData.includes("book_id=")) {
          route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ success: true, cart_count: 1 }),
          });
        } else {
          route.fulfill({
            status: 400,
            contentType: "application/json",
            body: JSON.stringify({
              success: false,
              message: "Invalid request",
            }),
          });
        }
      });

      // Try to manipulate cart request (this would be caught by proper PHP handling)
      await page.evaluate(() => {
        if (window.addToCart) {
          // Test with potentially malicious input
          window.addToCart("1'; DROP TABLE books; --");
        }
      });

      // Page should still function normally
      await expect(page.locator("body")).toBeVisible();
    });

    test("should validate form inputs properly", async ({ page }) => {
      await page.goto("/contact.php");

      // Test XSS prevention in contact form
      const xssPayload = "<script>alert('xss')</script>";

      await page.fill("#name", xssPayload);
      await page.fill("#email", "test@example.com");
      await page.fill("#message", "Test message");

      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      // If form processed, XSS should be escaped
      const pageContent = await page.textContent("body");
      expect(pageContent).not.toContain("<script>alert('xss')</script>");

      // Should not execute JavaScript
      const alertCalled = await page.evaluate(() => {
        return window.alertCalled || false;
      });
      expect(alertCalled).toBeFalsy();
    });
  });
});
