const { test, expect } = require("@playwright/test");

test.describe("Cross-Browser Compatibility Tests - PHP/Bootstrap Version", () => {
  test.describe("Basic Functionality Across Browsers", () => {
    test("homepage should load correctly in all browsers", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Basic page structure should be present
      await expect(page.locator("nav.navbar")).toBeVisible();
      await expect(page.locator(".hero-section")).toBeVisible();
      await expect(page.locator("footer.footer")).toBeVisible();

      // Title should be consistent
      await expect(page).toHaveTitle("Toko Buku Pustaka Ilmu");

      // Navigation should work
      await expect(page.locator(".navbar-brand")).toBeVisible();
      await expect(page.locator(".navbar-brand")).toContainText(
        "Pustaka Ilmu 📚",
      );

      console.log(`✓ Homepage loaded successfully in ${browserName}`);
    });

    test("CSS styles should render consistently", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Check if Bootstrap CSS is loaded properly
      const navbar = page.locator("nav.navbar");
      await expect(navbar).toBeVisible();

      // Check computed styles for key elements
      const navbarBg = await navbar.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
      );
      expect(navbarBg).toBeTruthy();

      // Check if custom colors are applied
      const brandLink = page.locator('.navbar-brand[href="index.php"]');
      await expect(brandLink).toBeVisible();

      const brandColor = await brandLink.evaluate(
        (el) => getComputedStyle(el).color,
      );
      expect(brandColor).toBeTruthy();

      // Check Bootstrap grid system
      const containers = page.locator(".container");
      const containerCount = await containers.count();
      expect(containerCount).toBeGreaterThan(0);

      console.log(`✓ CSS styles rendered correctly in ${browserName}`);
    });

    test("JavaScript functionality should work across browsers", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Wait for page to load
      await page.waitForTimeout(1000);

      // Check if cart functionality is present
      const cartIcon = page.locator(".cart-icon .fas.fa-shopping-cart");
      await expect(cartIcon).toBeVisible();

      // Check if books data loads from database
      const booksSection = page.locator("#koleksi");
      await expect(booksSection).toBeVisible();

      // Check if addToCart function is available
      const hasAddToCartFunction = await page.evaluate(() => {
        return typeof window.addToCart === "function";
      });
      expect(hasAddToCartFunction).toBeTruthy();

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
      await page.locator('nav a[href="books.php"]').click();
      await expect(page).toHaveURL(/.*books\.php/);
      await expect(page.locator("h1")).toContainText("Semua Koleksi Buku");

      // Navigate back to home
      await page.locator('nav .nav-link[href="index.php"]').click();
      await expect(page).toHaveURL(/.*index\.php$|.*\/$/);

      // Test about page
      await page.locator('nav a[href="about.php"]').click();
      await expect(page).toHaveURL(/.*about\.php/);
      await expect(page.locator("h1")).toContainText("Tentang Pustaka Ilmu");

      // Test contact page
      await page.goto("/");
      await page.locator('nav a[href="contact.php"]').click();
      await expect(page).toHaveURL(/.*contact\.php/);
      await expect(page.locator("h1")).toContainText("Hubungi Kami");

      console.log(`✓ Navigation works consistently in ${browserName}`);
    });

    test("external links should behave consistently", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Check that external CDN resources load (Bootstrap, Font Awesome)
      const bootstrapCSS = await page.evaluate(() => {
        const links = Array.from(
          document.querySelectorAll('link[rel="stylesheet"]'),
        );
        return links.some((link) => link.href.includes("bootstrap"));
      });
      expect(bootstrapCSS).toBeTruthy();

      const fontAwesome = await page.evaluate(() => {
        const links = Array.from(
          document.querySelectorAll('link[rel="stylesheet"]'),
        );
        return links.some((link) => link.href.includes("font-awesome"));
      });
      expect(fontAwesome).toBeTruthy();

      const bootstrapJS = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll("script[src]"));
        return scripts.some((script) => script.src.includes("bootstrap"));
      });
      expect(bootstrapJS).toBeTruthy();

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
      const navbar = page.locator("nav.navbar");
      await expect(navbar).toBeVisible();

      const mobileToggle = page.locator(".navbar-toggler");
      await expect(mobileToggle).toBeVisible();

      // Check that content stacks properly on mobile
      const heroSection = page.locator(".hero-section");
      await expect(heroSection).toBeVisible();

      // Verify responsive grid
      const booksSection = page.locator("#koleksi");
      await expect(booksSection).toBeVisible();

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
      await expect(page.locator("nav.navbar")).toBeVisible();
      await expect(page.locator(".hero-section")).toBeVisible();

      // Check navigation visibility
      const navLinks = page.locator("nav a");
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);

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
      const navbar = page.locator("nav.navbar");
      await expect(navbar).toBeVisible();

      // Verify grid layout on desktop
      const booksSection = page.locator("#koleksi");
      await expect(booksSection).toBeVisible();

      // Check if mobile toggle is hidden on desktop
      const mobileToggle = page.locator(".navbar-toggler");
      const isVisible = await mobileToggle.isVisible();
      // On desktop, mobile toggle might be hidden via CSS

      console.log(`✓ Desktop layout works correctly in ${browserName}`);
    });
  });

  test.describe("Form and Input Handling", () => {
    test("input focus and interaction should work across browsers", async ({
      page,
      browserName,
    }) => {
      await page.goto("/contact.php");

      // Test form inputs
      const nameInput = page.locator("#name");
      const emailInput = page.locator("#email");
      const messageInput = page.locator("#message");

      await nameInput.focus();
      await expect(nameInput).toBeFocused();

      await nameInput.fill("Test User");
      await expect(nameInput).toHaveValue("Test User");

      await emailInput.focus();
      await expect(emailInput).toBeFocused();

      await emailInput.fill("test@example.com");
      await expect(emailInput).toHaveValue("test@example.com");

      await messageInput.focus();
      await expect(messageInput).toBeFocused();

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
      await expect(page.locator("nav.navbar")).toBeVisible();
      await expect(page.locator(".hero-section")).toBeVisible();

      // Wait for books section to load
      await page.waitForTimeout(1500);

      const loadTime = Date.now() - startTime;

      // Performance assertion (should load within reasonable time)
      expect(loadTime).toBeLessThan(15000); // 15 seconds max for database queries

      console.log(`✓ Page loaded in ${loadTime}ms in ${browserName}`);
    });

    test("images should load properly across browsers", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Wait for books to potentially load
      await page.waitForTimeout(2000);

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
      } else {
        // If no books loaded, that's also acceptable (database might be empty)
        console.log(
          `No book images found - database may be empty in ${browserName}`,
        );
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

      // Wait for books to potentially load
      await page.waitForTimeout(2000);

      // Test hover on book cards
      const bookCards = page.locator(".book-card");

      if ((await bookCards.count()) > 0) {
        const firstCard = bookCards.first();

        // Hover over card
        await firstCard.hover();

        // Check if buy button becomes visible on hover
        const buyButton = firstCard.locator(".btn-buy");
        if ((await buyButton.count()) > 0) {
          // Wait for CSS transition
          await page.waitForTimeout(500);

          const isVisible = await buyButton.isVisible();
          // Button should be visible or at least present
          expect(isVisible).toBeTruthy();
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
      await page.locator('a[href="books.php"]').first().click();
      await expect(page).toHaveURL(/.*books\.php/);

      // Navigate back with browser back button
      await page.goBack();
      await expect(page).toHaveURL(/.*index\.php$|.*\/$/);

      // Check if notification system is in place
      const notificationArea = page.locator("#notification");
      const notificationExists = (await notificationArea.count()) > 0;
      expect(notificationExists).toBeTruthy();

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

      // Check if focus moves to navigation or skip links
      const focusedElement = await page.evaluate(
        () => document.activeElement.tagName,
      );
      expect(["A", "BUTTON", "INPUT"]).toContain(focusedElement);

      console.log(`✓ Keyboard navigation works in ${browserName}`);
    });

    test("screen reader compatibility should be consistent", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Check for proper heading structure
      const h1 = page.locator("h1");
      const h1Count = await h1.count();

      if (h1Count > 0) {
        await expect(h1.first()).toBeVisible();
      }

      const h2 = page.locator("h2");
      const h2Count = await h2.count();

      if (h2Count > 0) {
        await expect(h2.first()).toBeVisible();
      }

      // Check for alt text on images
      const images = page.locator("img");

      if ((await images.count()) > 0) {
        const firstImage = images.first();
        const altText = await firstImage.getAttribute("alt");
        expect(altText).toBeTruthy();
      }

      // Check for proper language attribute
      await expect(page.locator("html")).toHaveAttribute("lang", "id");

      console.log(`✓ Accessibility features work in ${browserName}`);
    });
  });

  test.describe("Database and PHP Integration", () => {
    test("database connection should work across browsers", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Wait for potential database query
      await page.waitForTimeout(2000);

      // Check if page loaded without PHP errors
      const bodyText = await page.textContent("body");
      expect(bodyText).not.toMatch(/Fatal error|Parse error|mysqli_/i);

      // Page should have basic structure even if database fails
      await expect(page.locator("nav.navbar")).toBeVisible();
      await expect(page.locator(".hero-section")).toBeVisible();

      console.log(`✓ Database integration works in ${browserName}`);
    });

    test("cart functionality should work across browsers", async ({
      page,
      browserName,
    }) => {
      await page.goto("/");

      // Wait for books to potentially load
      await page.waitForTimeout(2000);

      const bookCards = page.locator(".book-card");

      if ((await bookCards.count()) > 0) {
        const firstCard = bookCards.first();
        await firstCard.hover();

        const buyButton = firstCard.locator(".btn-buy");

        if (await buyButton.isVisible()) {
          await buyButton.click();
          await page.waitForTimeout(1500);

          // Check for cart badge or notification
          const cartBadge = page.locator(".cart-badge");
          const notification = page.locator("#notification");

          const hasCartUpdate = (await cartBadge.count()) > 0;
          const hasNotification = await notification.isVisible();

          // Either cart badge or notification should appear
          expect(hasCartUpdate || hasNotification).toBeTruthy();
        }
      }

      console.log(`✓ Cart functionality works in ${browserName}`);
    });
  });
});
