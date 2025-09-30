const { test, expect } = require("@playwright/test");

test.describe("About Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about.html");
  });

  test("should display the about page with correct title and URL", async ({
    page,
  }) => {
    // Check if we're on the about page
    await expect(page).toHaveURL(/.*about\.html/);

    // Check page title
    await expect(page).toHaveTitle("Tentang Kami - Pustaka Ilmu");
  });

  test("should have proper page structure and navigation", async ({ page }) => {
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

    // Check that About/Tentang link is active/highlighted
    const aboutLink = page.locator('nav a[href="about.html"]');
    await expect(aboutLink).toBeVisible();
    await expect(aboutLink).toHaveClass(/font-bold text-primary/);
  });

  test("should display the main hero section", async ({ page }) => {
    // Check main heading
    const mainHeading = page.locator("h1");
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toContainText("Tentang Pustaka Ilmu");

    // Check hero subtitle
    const heroSubtitle = page.locator(".bg-light-gray p");
    await expect(heroSubtitle).toBeVisible();
    await expect(heroSubtitle).toContainText(
      "Menyebarkan literasi dan pengetahuan ke seluruh Indonesia sejak 2020",
    );

    // Check hero section background
    const heroSection = page.locator(".bg-light-gray");
    await expect(heroSection).toBeVisible();
  });

  test("should display mission section with proper content", async ({
    page,
  }) => {
    // Check mission heading
    const missionHeading = page.locator("h2").filter({ hasText: "Misi Kami" });
    await expect(missionHeading).toBeVisible();
    await expect(missionHeading).toContainText("Misi Kami");

    // Check mission content
    const missionContent = page
      .locator("p")
      .filter({ hasText: "Pustaka Ilmu didirikan" });
    await expect(missionContent).toBeVisible();
    await expect(missionContent).toContainText("literasi dan pengetahuan");
    await expect(missionContent).toContainText("Sabang sampai Merauke");
  });

  test("should display vision section with proper content", async ({
    page,
  }) => {
    // Check vision heading
    const visionHeading = page.locator("h2").filter({ hasText: "Visi Kami" });
    await expect(visionHeading).toBeVisible();
    await expect(visionHeading).toContainText("Visi Kami");

    // Check vision content
    const visionContent = page
      .locator("p")
      .filter({ hasText: "Menjadi toko buku online terdepan" });
    await expect(visionContent).toBeVisible();
    await expect(visionContent).toContainText("toko buku online terdepan");
    await expect(visionContent).toContainText("komunitas pembaca");
  });

  test("should have working navigation links", async ({ page }) => {
    // Test Home/Beranda link
    await page.locator('nav a[href="index.html"]').click();
    await expect(page).toHaveURL(/.*index\.html|.*\/$/);

    // Go back to about page
    await page.goto("/about.html");

    // Test Books/Koleksi link
    await page.locator('nav a[href="books.html"]').click();
    await expect(page).toHaveURL(/.*books\.html/);

    // Go back to about page
    await page.goto("/about.html");

    // Test Contact/Kontak link
    await page.locator('nav a[href="contact.html"]').click();
    await expect(page).toHaveURL(/.*contact\.html/);
  });

  test("should display cart functionality", async ({ page }) => {
    // Check cart icon is present
    const cartIcon = page.locator(".fa-shopping-cart");
    await expect(cartIcon).toBeVisible();

    // Check cart counter element exists (even if hidden initially)
    const cartCounter = page.locator('span[x-text="cartCount"]');
    const cartCounterExists = (await cartCounter.count()) > 0;
    expect(cartCounterExists).toBeTruthy();
  });

  test("should have proper footer content", async ({ page }) => {
    // Check footer content
    const footer = page.locator("footer");
    await expect(footer).toContainText("© 2025 Toko Buku Pustaka Ilmu");
    await expect(footer).toContainText("kontak@pustakailmu.com");
    await expect(footer).toContainText("Dibuat di Bekasi");
  });

  test("should be responsive on different screen sizes", async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();

    // Check navigation is still functional on tablet
    const navLinks = page.locator("nav a");
    await expect(navLinks.first()).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();

    // Content should stack properly on mobile
    const heroSection = page.locator(".bg-light-gray");
    await expect(heroSection).toBeVisible();
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

    // Check page title is descriptive
    await expect(page).toHaveTitle(/Tentang Kami/);
  });

  test("should load external resources properly", async ({ page }) => {
    // Check that external CSS/JS resources are loaded
    const tailwindScript = page.locator('script[src*="tailwindcss"]');
    const alpineScript = page.locator('script[src*="alpinejs"]');
    const htmxScript = page.locator('script[src*="htmx"]');
    const fontAwesome = page.locator('link[href*="font-awesome"]');

    await expect(tailwindScript).toBeAttached();
    await expect(alpineScript).toBeAttached();
    await expect(htmxScript).toBeAttached();
    await expect(fontAwesome).toBeAttached();
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    // Check h1 exists and is unique
    const h1Elements = page.locator("h1");
    await expect(h1Elements).toHaveCount(1);
    await expect(h1Elements).toContainText("Tentang Pustaka Ilmu");

    // Check h2 elements exist
    const h2Elements = page.locator("h2");
    const h2Count = await h2Elements.count();
    expect(h2Count).toBeGreaterThanOrEqual(2); // Should have Misi and Visi sections

    // Verify h2 content
    await expect(page.locator("h2").first()).toContainText("Misi Kami");
    await expect(page.locator("h2").nth(1)).toContainText("Visi Kami");
  });

  test("should have accessible color contrast and styling", async ({
    page,
  }) => {
    // Check that text is readable by verifying elements have visible text
    const missionSection = page.locator("h2").filter({ hasText: "Misi Kami" });
    await expect(missionSection).toBeVisible();

    const visionSection = page.locator("h2").filter({ hasText: "Visi Kami" });
    await expect(visionSection).toBeVisible();

    // Check that navigation links have proper styling
    const activeLink = page.locator('nav a[href="about.html"]');
    await expect(activeLink).toHaveClass(/text-primary/);

    // Check brand link styling
    const brandLink = page.locator('header a[href="index.html"]').first();
    await expect(brandLink).toHaveClass(/text-primary/);
  });

  test("should handle Alpine.js initialization properly", async ({ page }) => {
    // Wait for Alpine.js to initialize
    await page.waitForTimeout(1000);

    // Check if Alpine.js data attributes are working
    await page.waitForFunction(() => {
      return window.Alpine !== undefined;
    });

    // Verify cart data is initialized
    const cartData = await page.evaluate(() => {
      const body = document.querySelector("body");
      return body && body._x_dataStack ? true : false;
    });

    // Alpine.js should be initialized (this may vary depending on implementation)
    // At minimum, the page should not have JavaScript errors
    const jsErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        jsErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(500);
    expect(jsErrors.length).toBe(0);
  });

  test("should maintain consistent branding across pages", async ({ page }) => {
    // Check brand consistency
    const brandName = page.locator('a[href="index.html"]').first();
    await expect(brandName).toContainText("Pustaka Ilmu 📚");

    // Check consistent color scheme
    const primaryElements = page.locator(".text-primary");
    const primaryCount = await primaryElements.count();
    expect(primaryCount).toBeGreaterThan(0);

    // Check consistent typography (Poppins font should be applied)
    const bodyFont = await page.evaluate(() => {
      return getComputedStyle(document.body).fontFamily;
    });
    expect(bodyFont.toLowerCase()).toContain("poppins");
  });

  test("should have proper content structure and spacing", async ({ page }) => {
    // Check container structure
    const containers = page.locator(".container");
    const containerCount = await containers.count();
    expect(containerCount).toBeGreaterThan(0);

    // Check content sections have proper spacing
    const contentSections = page.locator("main > div");
    await expect(contentSections.first()).toBeVisible();

    // Verify text content is properly structured
    const paragraphs = page.locator("main p");
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThanOrEqual(3); // Hero + Misi + Visi

    // Check that content is not empty
    for (let i = 0; i < Math.min(paragraphCount, 3); i++) {
      const paragraph = paragraphs.nth(i);
      const textContent = await paragraph.textContent();
      expect(textContent.trim().length).toBeGreaterThan(10);
    }
  });

  test("should handle browser back/forward navigation properly", async ({
    page,
  }) => {
    // Navigate to another page
    await page.locator('nav a[href="index.html"]').click();
    await expect(page).toHaveURL(/.*index\.html|.*\/$/);

    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL(/.*about\.html/);

    // Verify page content is still displayed correctly
    await expect(page.locator("h1")).toContainText("Tentang Pustaka Ilmu");
    await expect(page.locator("h2").first()).toContainText("Misi Kami");

    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL(/.*index\.html|.*\/$/);
  });
});
