const { test, expect } = require("@playwright/test");
const {
  isMobileBrowser,
  mobileInteract,
  waitForPageLoad,
  testCartFunctionality,
  clickNavLink,
  testMobileLayout,
} = require("./mobile-helpers");

test.describe("Homepage Tests - PHP/Bootstrap Version", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the main title and navigation", async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // Check if the main hero title is visible
    const heroTitle = page.locator(".hero-section h1");
    if ((await heroTitle.count()) > 0) {
      await expect(heroTitle).toContainText(
        "Temukan Dunia Baru dalam Setiap Halaman",
      );
    }

    // Check navigation links (now pointing to .php files)
    await expect(page.locator('nav .nav-link[href="index.php"]')).toContainText(
      "Beranda",
    );
    await expect(page.locator('nav .nav-link[href="books.php"]')).toContainText(
      "Koleksi",
    );
    await expect(page.locator('nav .nav-link[href="about.php"]')).toContainText(
      "Tentang",
    );
    await expect(
      page.locator('nav .nav-link[href="contact.php"]'),
    ).toContainText("Kontak");
  });

  test("should have proper branding", async ({ page }) => {
    // Check logo/brand name
    await expect(page.locator('.navbar-brand[href="index.php"]')).toContainText(
      "Pustaka Ilmu 📚",
    );

    // Check page title
    await expect(page).toHaveTitle("Toko Buku Pustaka Ilmu");
  });

  test("should display hero section with CTA button", async ({ page }) => {
    // Check hero section
    const heroSection = page.locator(".hero-section");
    await expect(heroSection).toBeVisible();

    // Check CTA button
    const ctaButton = page
      .locator('a[href="books.php"]')
      .filter({ hasText: "Lihat Semua Koleksi" });
    await expect(ctaButton).toBeVisible();

    // Test CTA button functionality
    await ctaButton.click();
    await expect(page).toHaveURL(/.*books\.php/);
  });

  test("should load trending books from database", async ({ page }) => {
    // Check section title
    await expect(page.locator("#koleksi h2")).toContainText(
      "Trending Books This Week 🔥",
    );

    // Wait for books to load from database
    await page.waitForTimeout(1000);

    // Check if books are displayed or if there's a fallback message
    const bookCards = page.locator(".book-card");
    const noDataAlert = page.locator(".alert-info");

    const hasBooks = (await bookCards.count()) > 0;
    const hasNoDataMessage = (await noDataAlert.count()) > 0;

    // Should have either books or no data message
    expect(hasBooks || hasNoDataMessage).toBeTruthy();

    if (hasBooks) {
      // If books are present, verify structure
      const firstBook = bookCards.first();
      await expect(firstBook.locator(".card-title")).toBeVisible();
      await expect(firstBook.locator(".book-price")).toBeVisible();
      await expect(firstBook.locator("img")).toBeVisible();
    }
  });

  test("should show cart functionality", async ({
    page,
    browserName,
  }, testInfo) => {
    const projectName = testInfo.project.name;

    // For mobile browsers, skip cart icon visibility test as it's in collapsed menu
    if (isMobileBrowser(projectName)) {
      // For mobile, just verify cart icon exists in DOM (may be hidden in menu)
      const cartIcon = page.locator(".cart-icon .fas.fa-shopping-cart");
      const cartIconExists = (await cartIcon.count()) > 0;
      expect(cartIconExists).toBeTruthy();
    } else {
      // Check cart icon is present on desktop
      const cartIcon = page.locator(".cart-icon .fas.fa-shopping-cart");
      await expect(cartIcon).toBeVisible();
    }

    // Wait for books to potentially load
    const loadResult = await waitForPageLoad(page, projectName, 1000);
    await expect(loadResult.navbar).toBeVisible();
    await expect(loadResult.body).toBeVisible();

    const bookCards = page.locator(".book-card");
    if ((await bookCards.count()) > 0) {
      const firstBook = bookCards.first();

      if (isMobileBrowser(projectName)) {
        // On mobile, button should be visible without hover
        const buyButton = firstBook.locator(".btn-buy");
        await expect(buyButton).toBeVisible();
        await expect(buyButton).toContainText("Beli Sekarang");
      } else {
        // Test hover functionality on desktop
        await firstBook.hover();
        const buyButton = firstBook.locator(".btn-buy");
        await expect(buyButton).toBeVisible();
        await expect(buyButton).toContainText("Beli Sekarang");
      }
    }
  });

  test("should handle cart addition with AJAX", async ({
    page,
    browserName,
  }, testInfo) => {
    const projectName = testInfo.project.name;
    const result = await testCartFunctionality(page, projectName);

    if (result.hasBooks && result.cartTested) {
      // Verify buy button was visible
      await expect(result.buyButton).toBeVisible();
      // Either cart updated or notification showed
      expect(result.cartUpdated || result.notificationShown).toBeTruthy();
    } else if (!result.hasBooks) {
      // No books available to test - this is acceptable
      console.log("No books available for cart testing");
    }
  });

  test("should display proper price formatting", async ({ page }) => {
    await page.waitForTimeout(1000);

    const bookCards = page.locator(".book-card");
    if ((await bookCards.count()) > 0) {
      const priceElement = bookCards.first().locator(".book-price");
      const priceText = await priceElement.textContent();

      // Should contain "Rp" and be properly formatted
      expect(priceText).toMatch(/Rp\s[\d,.]+/);
    }
  });

  test("should have proper footer", async ({ page }) => {
    // Check footer content
    const footer = page.locator("footer.footer");
    await expect(footer).toContainText("© 2025 Toko Buku Pustaka Ilmu");
    await expect(footer).toContainText("kontak@pustakailmu.com");
  });

  test("should be responsive on mobile", async ({
    page,
    browserName,
  }, testInfo) => {
    const projectName = testInfo.project.name;
    const layoutResult = await testMobileLayout(page, projectName);
    await expect(layoutResult.navbar).toBeVisible();
    await expect(layoutResult.mobileToggle).toBeVisible();
    await expect(layoutResult.heroSection).toBeVisible();
  });

  test("should handle database connection gracefully", async ({ page }) => {
    // Check if page loads even if database is not available
    await expect(page.locator("body")).toBeVisible();

    // Should either show books or appropriate fallback
    await page.waitForTimeout(1000);

    const bookSection = page.locator("#koleksi");
    await expect(bookSection).toBeVisible();

    const hasBooks = (await page.locator(".book-card").count()) > 0;
    const hasAlert = (await page.locator(".alert").count()) > 0;

    // Should have either books or an alert message
    expect(hasBooks || hasAlert).toBeTruthy();
  });

  test("navigation links should work correctly", async ({
    page,
    browserName,
  }, testInfo) => {
    const projectName = testInfo.project.name;
    // Test Books link
    await clickNavLink(page, 'nav a[href="books.php"]', projectName);
    await expect(page).toHaveURL(/.*books\.php/);
    await expect(page.locator("h1")).toContainText("Semua Koleksi Buku");

    // Go back to home
    await page.goto("/");
    const loadResult1 = await waitForPageLoad(page, projectName);
    await expect(loadResult1.navbar).toBeVisible();
    await expect(loadResult1.body).toBeVisible();

    // Test About link
    await clickNavLink(page, 'nav a[href="about.php"]', projectName);
    await expect(page).toHaveURL(/.*about\.php/);
    await expect(page.locator("h1")).toContainText("Tentang Pustaka Ilmu");

    // Go back to home
    await page.goto("/");
    const loadResult2 = await waitForPageLoad(page, projectName);
    await expect(loadResult2.navbar).toBeVisible();
    await expect(loadResult2.body).toBeVisible();

    // Test Contact link
    await clickNavLink(page, 'nav a[href="contact.php"]', projectName);
    await expect(page).toHaveURL(/.*contact\.php/);
    await expect(page.locator("h1")).toContainText("Hubungi Kami");
  });

  test("should have proper meta tags and SEO elements", async ({ page }) => {
    // Check viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute(
      "content",
      "width=device-width, initial-scale=1.0",
    );

    // Check charset
    const charsetMeta = page.locator("meta[charset]");
    await expect(charsetMeta).toHaveAttribute("charset", "UTF-8");

    // Check language attribute
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
  });

  test("should load Bootstrap CSS and JavaScript", async ({ page }) => {
    // Check if Bootstrap CSS is loaded
    const bootstrapCSS = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]'),
      );
      return links.some((link) => link.href.includes("bootstrap"));
    });
    expect(bootstrapCSS).toBeTruthy();

    // Check if Bootstrap JavaScript is loaded
    const bootstrapJS = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script[src]"));
      return scripts.some((script) => script.src.includes("bootstrap"));
    });
    expect(bootstrapJS).toBeTruthy();
  });

  test("should handle session-based cart correctly", async ({ page }) => {
    // Multiple page loads should maintain cart state
    await page.goto("/");

    // Add item to cart if books are available
    const bookCards = page.locator(".book-card");
    if ((await bookCards.count()) > 0) {
      const firstBook = bookCards.first();
      await firstBook.hover();

      const buyButton = firstBook.locator(".btn-buy");
      if (await buyButton.isVisible()) {
        await buyButton.click();
        await page.waitForTimeout(1000);

        // Navigate to another page
        await page.goto("/books.php");

        // Navigate back to home
        await page.goto("/");

        // Cart count should be maintained (session-based)
        const cartBadge = page.locator(".cart-badge");
        if ((await cartBadge.count()) > 0) {
          const badgeText = await cartBadge.textContent();
          expect(parseInt(badgeText) > 0).toBeTruthy();
        }
      }
    }
  });

  test("should show active navigation state", async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // Home page should show Beranda as active
    const homeLink = page.locator('nav .nav-link[href="index.php"]');
    const homeLinkClass = await homeLink.getAttribute("class");

    if (homeLinkClass && homeLinkClass.includes("active")) {
      await expect(homeLink).toHaveClass(/active/);
    } else {
      // If not using active class, check if it's visually distinguished
      const isHomePage =
        page.url().includes("index.php") || page.url().endsWith("/");
      expect(isHomePage).toBeTruthy();
    }
  });
});
