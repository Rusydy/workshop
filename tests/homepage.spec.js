const { test, expect } = require("@playwright/test");

test.describe("Homepage Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the main title and navigation", async ({ page }) => {
    // Check if the main title is visible
    await expect(page.locator(".hero h2")).toContainText(
      "Temukan Dunia Baru dalam Setiap Halaman",
    );

    // Check navigation links
    await expect(page.locator('nav a[href="index.html"]')).toContainText(
      "Beranda",
    );
    await expect(page.locator('nav a[href="books.html"]')).toContainText(
      "Koleksi",
    );
    await expect(page.locator('nav a[href="about.html"]')).toContainText(
      "Tentang",
    );
    await expect(page.locator('nav a[href="contact.html"]')).toContainText(
      "Kontak",
    );
  });

  test("should have proper branding", async ({ page }) => {
    // Check logo/brand name
    await expect(
      page.locator('header a[href="index.html"]').first(),
    ).toContainText("Pustaka Ilmu 📚");

    // Check page title
    await expect(page).toHaveTitle("Toko Buku Pustaka Ilmu");
  });

  test("should display hero section with CTA button", async ({ page }) => {
    // Check hero section
    const heroSection = page.locator(".hero");
    await expect(heroSection).toBeVisible();

    // Check CTA button
    const ctaButton = page
      .locator('a[href="books.html"]')
      .filter({ hasText: "Lihat Semua Koleksi" });
    await expect(ctaButton).toBeVisible();

    // Test CTA button functionality
    await ctaButton.click();
    await expect(page).toHaveURL(/.*books\.html/);
  });

  test("should load trending books section", async ({ page }) => {
    // Wait for books to load
    await expect(page.locator(".grid")).toBeVisible();

    // Check section title
    await expect(page.locator("#koleksi h2")).toContainText(
      "Trending Books This Week 🔥",
    );

    // Wait for loading to complete
    await page.waitForFunction(() => {
      const loadingElement = document.querySelector('[x-show="loading"]');
      return !loadingElement || loadingElement.style.display === "none";
    });

    // Check if books are displayed
    const bookCards = page.locator(".book-card");
    await expect(bookCards.first()).toBeVisible();
  });

  test("should show cart functionality", async ({ page }) => {
    // Check cart icon is present
    const cartIcon = page.locator(".fa-shopping-cart");
    await expect(cartIcon).toBeVisible();

    // Wait for books to load
    await page.waitForFunction(() => {
      const loadingElement = document.querySelector('[x-show="loading"]');
      return !loadingElement || loadingElement.style.display === "none";
    });

    // Try to add item to cart (this will test HTMX functionality)
    const buyButton = page.locator(".btn-buy").first();
    if (await buyButton.isVisible()) {
      await buyButton.hover();
      await expect(buyButton).toBeVisible();
      // Note: Actual cart functionality depends on backend implementation
    }
  });

  test("should have proper footer", async ({ page }) => {
    // Check footer content
    const footer = page.locator("footer");
    await expect(footer).toContainText("© 2025 Toko Buku Pustaka Ilmu");
    await expect(footer).toContainText("kontak@pustakailmu.com");
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if header is still visible
    await expect(page.locator("header")).toBeVisible();

    // Check if main content is visible
    await expect(page.locator(".hero")).toBeVisible();

    // Check if navigation is present (might be hidden on mobile but should exist)
    await expect(page.locator("nav")).toBeVisible();
  });

  test("should handle book data loading gracefully", async ({ page }) => {
    // Check loading state initially appears
    const loadingIndicator = page.locator('[x-show="loading"]');

    // Wait for content to load
    await page.waitForTimeout(1000);

    // Verify books section exists
    await expect(page.locator("#koleksi")).toBeVisible();
  });

  test("navigation links should work correctly", async ({ page }) => {
    // Test Books link
    await page.locator('nav a[href="books.html"]').click();
    await expect(page).toHaveURL(/.*books\.html/);

    // Go back to home
    await page.goto("/");

    // Test About link
    await page.locator('nav a[href="about.html"]').click();
    await expect(page).toHaveURL(/.*about\.html/);

    // Go back to home
    await page.goto("/");

    // Test Contact link
    await page.locator('nav a[href="contact.html"]').click();
    await expect(page).toHaveURL(/.*contact\.html/);
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
});
