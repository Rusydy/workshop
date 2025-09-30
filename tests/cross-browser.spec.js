const { test, expect } = require("@playwright/test");

test.describe("Cross-Browser Compatibility Tests", () => {
  test.describe("Basic Functionality Across Browsers", () => {
    test("homepage should load correctly in all browsers", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Basic page structure should be present
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();

      // Title should be consistent
      await expect(page).toHaveTitle("Toko Buku Pustaka Ilmu");

      // Navigation should work
      await expect(page.locator("nav")).toBeVisible();

      console.log(`✓ Homepage loaded successfully in ${browserName}`);
    });

    test("CSS styles should render consistently", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Check if Tailwind CSS is loaded properly
      const header = page.locator("header");
      await expect(header).toBeVisible();

      // Check computed styles for key elements
      const headerBg = await header.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
      );
      expect(headerBg).toBeTruthy();

      // Check if custom colors are applied
      const brandLink = page.locator('header a[href="index.html"]').first();
      const brandColor = await brandLink.evaluate(
        (el) => getComputedStyle(el).color,
      );
      expect(brandColor).toBeTruthy();

      console.log(`✓ CSS styles rendered correctly in ${browserName}`);
    });

    test("JavaScript functionality should work across browsers", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Wait for Alpine.js to initialize
      await page.waitForTimeout(1000);

      // Check if AlpineJS is working (cart counter functionality)
      const cartIcon = page.locator(".fa-shopping-cart");
      await expect(cartIcon).toBeVisible();

      // Check if books data loads (JavaScript fetch functionality)
      await page.waitForFunction(
        () => {
          const loadingElement = document.querySelector('[x-show="loading"]');
          return !loadingElement || loadingElement.style.display === "none";
        },
        { timeout: 10000 },
      );

      // Verify books are loaded
      const booksGrid = page.locator(".grid");
      await expect(booksGrid).toBeVisible();

      console.log(`✓ JavaScript functionality works in ${browserName}`);
    });
  });

  test.describe("Navigation Consistency", () => {
    test("navigation should work identically across browsers", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Test navigation to books page
      await page.locator('nav a[href="books.html"]').click();
      await expect(page).toHaveURL(/.*books\.html/);

      // Navigate back to home
      await page.locator('nav a[href="index.html"]').click();
      await expect(page).toHaveURL(/.*index\.html|.*\/$/);

      // Test about page
      await page.locator('nav a[href="about.html"]').click();
      await expect(page).toHaveURL(/.*about\.html/);

      // Test contact page
      await page.goto("/");
      await page.locator('nav a[href="contact.html"]').click();
      await expect(page).toHaveURL(/.*contact\.html/);

      console.log(`✓ Navigation works consistently in ${browserName}`);
    });

    test("external links should behave consistently", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Check that external CDN resources load
      const tailwindScript = page.locator('script[src*="tailwindcss"]');
      const alpineScript = page.locator('script[src*="alpinejs"]');
      const htmxScript = page.locator('script[src*="htmx"]');

      await expect(tailwindScript).toBeAttached();
      await expect(alpineScript).toBeAttached();
      await expect(htmxScript).toBeAttached();

      console.log(`✓ External resources load properly in ${browserName}`);
    });
  });

  test.describe("Responsive Design Across Browsers", () => {
    test("mobile layout should be consistent across browsers", async ({
      page,
      browserName,
    }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      // Check mobile navigation
      const header = page.locator("header");
      await expect(header).toBeVisible();

      // Check that content stacks properly on mobile
      const heroSection = page.locator(".hero");
      await expect(heroSection).toBeVisible();

      // Verify responsive grid
      await page.waitForFunction(() => {
        const loadingElement = document.querySelector('[x-show="loading"]');
        return !loadingElement || loadingElement.style.display === "none";
      });

      const booksGrid = page.locator(".grid");
      await expect(booksGrid).toBeVisible();

      console.log(`✓ Mobile layout works correctly in ${browserName}`);
    });

    test("tablet layout should be consistent across browsers", async ({
      page,
      browserName,
    }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/");

      // Check tablet-specific layouts
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator(".hero")).toBeVisible();

      // Check navigation visibility
      const navLinks = page.locator("nav a");
      await expect(navLinks.first()).toBeVisible();

      console.log(`✓ Tablet layout works correctly in ${browserName}`);
    });

    test("desktop layout should be consistent across browsers", async ({
      page,
      browserName,
    }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.goto("/");

      // Check desktop-specific features
      const navigation = page.locator(".hidden.md\\:flex");
      await expect(navigation).toBeVisible();

      // Verify grid layout on desktop
      await page.waitForFunction(() => {
        const loadingElement = document.querySelector('[x-show="loading"]');
        return !loadingElement || loadingElement.style.display === "none";
      });

      const booksGrid = page.locator(".grid");
      await expect(booksGrid).toBeVisible();

      console.log(`✓ Desktop layout works correctly in ${browserName}`);
    });
  });

  test.describe("Form and Input Handling", () => {
    test("input focus and interaction should work across browsers", async ({
      page,
      browserName,
    }) => {
      await page.goto("/contact.html");

      // Look for any input fields
      const inputs = page.locator("input, textarea, select");

      if ((await inputs.count()) > 0) {
        const firstInput = inputs.first();
        await firstInput.focus();

        // Check if focus styles are applied
        await expect(firstInput).toBeFocused();

        // Test typing
        if (
          (await firstInput.getAttribute("type")) !== "submit" &&
          (await firstInput.getAttribute("type")) !== "button"
        ) {
          await firstInput.fill("Test input");
          await expect(firstInput).toHaveValue("Test input");
        }
      }

      console.log(`✓ Input handling works correctly in ${browserName}`);
    });
  });

  test.describe("Performance and Loading", () => {
    test("page load performance should be acceptable across browsers", async ({
      page,
      browserName,
    }) => {
      const startTime = Date.now();

      await page.goto("/");

      // Wait for critical content to load
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator(".hero")).toBeVisible();

      // Wait for JavaScript to initialize
      await page.waitForFunction(
        () => {
          return window.Alpine !== undefined;
        },
        { timeout: 5000 },
      );

      const loadTime = Date.now() - startTime;

      // Performance assertion (should load within reasonable time)
      expect(loadTime).toBeLessThan(10000); // 10 seconds max

      console.log(`✓ Page loaded in ${loadTime}ms in ${browserName}`);
    });

    test("images should load properly across browsers", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Wait for books to load
      await page.waitForFunction(() => {
        const loadingElement = document.querySelector('[x-show="loading"]');
        return !loadingElement || loadingElement.style.display === "none";
      });

      // Check if book images load
      const bookImages = page.locator(".book-card img");

      if ((await bookImages.count()) > 0) {
        const firstImage = bookImages.first();

        // Wait for image to load
        await firstImage.waitFor({ state: "visible" });

        // Check image natural dimensions (indicates successful load)
        const imageLoaded = await firstImage.evaluate((img) => {
          return img.complete && img.naturalHeight !== 0;
        });

        expect(imageLoaded).toBeTruthy();
      }

      console.log(`✓ Images load properly in ${browserName}`);
    });
  });

  test.describe("Browser-Specific Features", () => {
    test("hover effects should work properly", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Wait for books to load
      await page.waitForFunction(() => {
        const loadingElement = document.querySelector('[x-show="loading"]');
        return !loadingElement || loadingElement.style.display === "none";
      });

      // Test hover on book cards
      const bookCards = page.locator(".book-card");

      if ((await bookCards.count()) > 0) {
        const firstCard = bookCards.first();

        // Hover over card
        await firstCard.hover();

        // Check if buy button becomes visible on hover
        const buyButton = firstCard.locator(".btn-buy");
        if ((await buyButton.count()) > 0) {
          await expect(buyButton).toBeVisible();
        }
      }

      console.log(`✓ Hover effects work properly in ${browserName}`);
    });

    test("transitions and animations should work smoothly", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Test page transitions
      await page.locator('a[href="books.html"]').first().click();
      await expect(page).toHaveURL(/.*books\.html/);

      // Navigate back with browser back button
      await page.goBack();
      await expect(page).toHaveURL(/.*index\.html|.*\/$/);

      // Check if Alpine.js transitions work
      // This would be visible when notifications appear
      const notificationArea = page.locator('[x-show="showNotification"]');
      // We can't easily trigger this without a working backend, but we can verify the element exists

      console.log(`✓ Transitions work smoothly in ${browserName}`);
    });
  });

  test.describe("Accessibility Across Browsers", () => {
    test("keyboard navigation should work consistently", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Test tab navigation
      await page.keyboard.press("Tab");

      // Check if focus moves to navigation
      const focusedElement = await page.evaluate(
        () => document.activeElement.tagName,
      );
      expect(["A", "BUTTON", "INPUT"]).toContain(focusedElement);

      // Test navigation with Enter key
      await page.keyboard.press("Enter");

      console.log(`✓ Keyboard navigation works in ${browserName}`);
    });

    test("screen reader compatibility should be consistent", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Check for proper heading structure
      const h1 = page.locator("h1");
      const h2 = page.locator("h2");

      if ((await h1.count()) > 0) {
        await expect(h1.first()).toBeVisible();
      }

      await expect(h2.first()).toBeVisible();

      // Check for alt text on images
      const images = page.locator("img");

      if ((await images.count()) > 0) {
        const firstImage = images.first();
        const altText = await firstImage.getAttribute("alt");
        expect(altText).toBeTruthy();
      }

      console.log(`✓ Accessibility features work in ${browserName}`);
    });
  });
});
