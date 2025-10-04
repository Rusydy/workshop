const { test, expect } = require("@playwright/test");
const {
  isMobileBrowser,
  waitForPageLoad,
  clickNavLink,
} = require("./mobile-helpers");

test.describe("About Page Tests - PHP/Bootstrap Version", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about.php");
  });

  test("should display the about page correctly", async ({ page }) => {
    // Check page title
    await expect(page.locator("h1")).toContainText("Tentang Pustaka Ilmu");

    // Check subtitle
    await expect(page.locator(".hero-section p")).toContainText(
      "Menyebarkan literasi dan pengetahuan ke seluruh Indonesia sejak 2020",
    );

    // Verify page URL
    await expect(page).toHaveURL(/.*about\.php/);

    // Check navigation shows about as active
    const aboutNavLink = page.locator('nav a[href="about.php"]');
    await expect(aboutNavLink).toHaveClass(/active/);
  });

  test("should have proper page title", async ({ page }) => {
    await expect(page).toHaveTitle("Tentang Kami - Pustaka Ilmu");
  });

  test("should display mission section", async ({ page }) => {
    // Check mission heading
    await expect(
      page.locator("h2").filter({ hasText: "Misi Kami" }),
    ).toBeVisible();

    // Check mission content
    const missionContent = page.locator(
      "text=Pustaka Ilmu didirikan dengan misi",
    );
    await expect(missionContent).toBeVisible();

    // Verify mission text mentions key points
    const missionText = await page
      .locator("h2:has-text('Misi Kami') + p")
      .textContent();
    expect(missionText).toMatch(/literasi/i);
    expect(missionText).toMatch(/pengetahuan/i);
    expect(missionText).toMatch(/Indonesia/i);
  });

  test("should display vision section", async ({ page }) => {
    // Check vision heading
    await expect(
      page.locator("h2").filter({ hasText: "Visi Kami" }),
    ).toBeVisible();

    // Check vision content
    const visionContent = page.locator(
      "text=Menjadi toko buku online terdepan",
    );
    await expect(visionContent).toBeVisible();

    // Verify vision text mentions key points
    const visionText = await page
      .locator("h2:has-text('Visi Kami') + p")
      .textContent();
    expect(visionText).toMatch(/toko buku online/i);
    expect(visionText).toMatch(/Indonesia/i);
    expect(visionText).toMatch(/komunitas pembaca/i);
  });

  test("should display statistics cards", async ({ page }) => {
    // Check for statistics section
    const statsCards = page.locator(".bg-light.rounded-3");
    const statsCount = await statsCards.count();
    expect(statsCount).toBeGreaterThanOrEqual(3);

    // Check first stat card (1000+ Judul)
    const firstCard = statsCards.first();
    await expect(firstCard.locator(".fas.fa-book-open")).toBeVisible();
    await expect(firstCard.locator("h5")).toContainText("1000+ Judul");
    await expect(firstCard.locator("p")).toContainText(
      "Koleksi buku dari berbagai genre",
    );

    // Check second stat card (5000+ Pembaca)
    const secondCard = statsCards.nth(1);
    await expect(secondCard.locator(".fas.fa-users")).toBeVisible();
    await expect(secondCard.locator("h5")).toContainText("5000+ Pembaca");
    await expect(secondCard.locator("p")).toContainText(
      "Komunitas pembaca aktif",
    );

    // Check third stat card (5 Tahun)
    const thirdCard = statsCards.nth(2);
    await expect(thirdCard.locator(".fas.fa-heart")).toBeVisible();
    await expect(thirdCard.locator("h5")).toContainText("5 Tahun");
    await expect(thirdCard.locator("p")).toContainText(
      "Pengalaman melayani Indonesia",
    );
  });

  test("should have proper Bootstrap styling", async ({ page }) => {
    // Check hero section has Bootstrap classes
    const heroSection = page.locator(".hero-section");
    await expect(heroSection).toBeVisible();

    // Check container classes
    const containers = page.locator(".container");
    const containerCount = await containers.count();
    expect(containerCount).toBeGreaterThan(0);

    // Check grid layout for statistics
    const rowElements = page.locator(".row");
    const rowCount = await rowElements.count();
    expect(rowCount).toBeGreaterThan(0);

    // Check column classes in statistics section
    const colElements = page.locator(".col-md-4");
    const colCount = await colElements.count();
    expect(colCount).toBe(3); // Should have 3 stat columns
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check mobile navigation
    const mobileToggle = page.locator(".navbar-toggler");
    await expect(mobileToggle).toBeVisible();

    // Check hero section is responsive
    const heroSection = page.locator(".hero-section");
    await expect(heroSection).toBeVisible();

    // Check content is readable on mobile
    const mainContent = page.locator("h2").filter({ hasText: "Misi Kami" });
    await expect(mainContent).toBeVisible();

    // Check statistics cards stack properly on mobile
    const statsCards = page.locator(".col-md-4");
    if ((await statsCards.count()) > 0) {
      const firstCard = statsCards.first();
      const cardBox = await firstCard.boundingBox();
      const viewport = await page.viewportSize();

      if (cardBox && viewport) {
        expect(cardBox.width).toBeLessThanOrEqual(viewport.width);
      }
    }
  });

  test("should have working navigation", async ({ page, browserName }) => {
    const loadResult1 = await waitForPageLoad(page, browserName);
    await expect(loadResult1.navbar).toBeVisible();
    await expect(loadResult1.body).toBeVisible();

    // Check brand link works
    await clickNavLink(page, '.navbar-brand[href="index.php"]', browserName);
    await expect(page).toHaveURL(/.*index\.php$|.*\/$/);

    // Go back to about page
    await page.goto("/about.php");
    const loadResult2 = await waitForPageLoad(page, browserName);
    await expect(loadResult2.navbar).toBeVisible();
    await expect(loadResult2.body).toBeVisible();

    // Check other navigation links work
    await clickNavLink(page, 'nav a[href="books.php"]', browserName);
    await expect(page).toHaveURL(/.*books\.php/);

    // Go back to about page
    await page.goto("/about.php");
    const loadResult3 = await waitForPageLoad(page, browserName);
    await expect(loadResult3.navbar).toBeVisible();
    await expect(loadResult3.body).toBeVisible();

    await clickNavLink(page, 'nav a[href="contact.php"]', browserName);
    await expect(page).toHaveURL(/.*contact\.php/);
  });

  test("should display proper typography and spacing", async ({ page }) => {
    // Check main heading typography
    const mainHeading = page.locator(".hero-section h1");
    await expect(mainHeading).toHaveClass(/display-4/);
    await expect(mainHeading).toHaveClass(/fw-bold/);

    // Check section headings
    const sectionHeadings = page.locator("h2");
    const headingCount = await sectionHeadings.count();
    expect(headingCount).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < Math.min(headingCount, 2); i++) {
      const heading = sectionHeadings.nth(i);
      const headingClasses = await heading.getAttribute("class");
      expect(headingClasses).toMatch(/display-6|fw-bold/);
    }

    // Check proper spacing between sections
    const contentSections = page.locator("section, .container > div");
    const sectionCount = await contentSections.count();
    expect(sectionCount).toBeGreaterThan(1);
  });

  test("should have proper semantic HTML structure", async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // Check for main content area
    const mainContent = page.locator("main, section");
    if ((await mainContent.count()) > 0) {
      await expect(mainContent.first()).toBeVisible();
    }

    // Check proper heading hierarchy
    const h1Count = await page.locator("h1").count();
    if (h1Count > 0) {
      expect(h1Count).toBe(1); // Should have exactly one H1
    }

    const h2Count = await page.locator("h2").count();
    if (h2Count > 0) {
      expect(h2Count).toBeGreaterThanOrEqual(2); // Should have Misi and Visi sections
    }

    // Check for proper landmark elements
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("should load quickly and efficiently", async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();

    await page.goto("/about.php", { waitUntil: "domcontentloaded" });

    const loadTime = Date.now() - startTime;

    // Should load within reasonable time (static content)
    expect(loadTime).toBeLessThan(3000);

    // Check that all essential content is loaded
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h2").first()).toBeVisible();
    await expect(page.locator(".bg-light.rounded-3").first()).toBeVisible();
  });

  test("should have accessible Font Awesome icons", async ({ page }) => {
    // Check Font Awesome icons are loaded
    const icons = page.locator(".fas");
    const iconCount = await icons.count();
    expect(iconCount).toBeGreaterThanOrEqual(3); // book-open, users, heart

    // Check specific icons exist
    await expect(page.locator(".fas.fa-book-open")).toBeVisible();
    await expect(page.locator(".fas.fa-users")).toBeVisible();
    await expect(page.locator(".fas.fa-heart")).toBeVisible();

    // Check icons have proper color styling
    const primaryColorIcons = page.locator(".fas.text-primary");
    const primaryIconCount = await primaryColorIcons.count();
    expect(primaryIconCount).toBeGreaterThanOrEqual(3);
  });

  test("should maintain consistent branding", async ({ page }) => {
    // Check brand name in navigation
    const brandElement = page.locator(".navbar-brand");
    await expect(brandElement).toContainText("Pustaka Ilmu 📚");

    // Check footer branding
    const footer = page.locator("footer");
    await expect(footer).toContainText("Toko Buku Pustaka Ilmu");
    await expect(footer).toContainText("kontak@pustakailmu.com");

    // Check consistent color scheme
    const primaryColorElements = page.locator(".text-primary");
    const primaryCount = await primaryColorElements.count();
    expect(primaryCount).toBeGreaterThan(0);
  });

  test("should have proper meta tags", async ({ page }) => {
    // Check language attribute
    await expect(page.locator("html")).toHaveAttribute("lang", "id");

    // Check viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute(
      "content",
      "width=device-width, initial-scale=1.0",
    );

    // Check charset
    const charsetMeta = page.locator("meta[charset]");
    await expect(charsetMeta).toHaveAttribute("charset", "UTF-8");
  });

  test("should handle content overflow gracefully", async ({ page }) => {
    // Test with very narrow viewport
    await page.setViewportSize({ width: 320, height: 568 });

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Content should not overflow
    const mainContent = page.locator("main, section");
    if ((await mainContent.count()) > 0) {
      await expect(mainContent.first()).toBeVisible();
    }

    // Text should wrap properly
    const missionText = page.locator("h2:has-text('Misi Kami') + p");
    if ((await missionText.count()) > 0) {
      await expect(missionText).toBeVisible();
    }

    // Statistics cards should stack properly
    const statsCards = page.locator(".col-md-4");
    const cardCount = await statsCards.count();

    if (cardCount > 0) {
      // Check at least the first card is visible
      await expect(statsCards.first()).toBeVisible();

      // Check that cards don't overflow viewport
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = statsCards.nth(i);
        const cardBox = await card.boundingBox();
        if (cardBox) {
          expect(cardBox.width).toBeLessThanOrEqual(320);
        }
      }
    }
  });
});
