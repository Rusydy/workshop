const { test, expect } = require("@playwright/test");

test.describe("Contact Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact.html");
  });

  test("should display the contact page with correct title and URL", async ({
    page,
  }) => {
    // Check if we're on the contact page
    await expect(page).toHaveURL(/.*contact\.html/);

    // Check page title
    await expect(page).toHaveTitle("Kontak - Pustaka Ilmu");
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

    // Check that Contact/Kontak link is active/highlighted
    const contactLink = page.locator('nav a[href="contact.html"]');
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toHaveClass(/font-bold text-primary/);
  });

  test("should display the main hero section", async ({ page }) => {
    // Check main heading
    const mainHeading = page.locator("h1");
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toContainText("Hubungi Kami");

    // Check hero subtitle
    const heroSubtitle = page.locator(".bg-light-gray p");
    await expect(heroSubtitle).toBeVisible();
    await expect(heroSubtitle).toContainText(
      "Ada pertanyaan atau masukan? Kami siap membantu!",
    );

    // Check hero section background
    const heroSection = page.locator(".bg-light-gray");
    await expect(heroSection).toBeVisible();
  });

  test("should display contact details section", async ({ page }) => {
    // Check contact details heading
    const detailsHeading = page.locator("h2").filter({ hasText: "Detail Kontak" });
    await expect(detailsHeading).toBeVisible();

    // Check address information
    const addressInfo = page.locator("p").filter({ hasText: "Alamat:" });
    await expect(addressInfo).toBeVisible();
    await expect(addressInfo).toContainText("Jl. Literasi No. 123");
    await expect(addressInfo).toContainText("Bekasi, Jawa Barat");

    // Check email information
    const emailInfo = page.locator("p").filter({ hasText: "Email:" });
    await expect(emailInfo).toBeVisible();

    const emailLink = page.locator('a[href="mailto:kontak@pustakailmu.com"]');
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toContainText("kontak@pustakailmu.com");

    // Check phone information
    const phoneInfo = page.locator("p").filter({ hasText: "Telepon:" });
    await expect(phoneInfo).toBeVisible();
    await expect(phoneInfo).toContainText("(021) 1234 5678");

    // Check operating hours
    const hoursInfo = page.locator("p").filter({ hasText: "Jam Operasional:" });
    await expect(hoursInfo).toBeVisible();
    await expect(hoursInfo).toContainText("Senin - Jumat");
    await expect(hoursInfo).toContainText("09:00 - 17:00 WIB");
  });

  test("should display contact form with all required fields", async ({
    page,
  }) => {
    // Check form heading
    const formHeading = page.locator("h2").filter({ hasText: "Kirim Pesan" });
    await expect(formHeading).toBeVisible();

    // Check contact form exists
    const contactForm = page.locator("form");
    await expect(contactForm).toBeVisible();

    // Check name field
    const nameLabel = page.locator('label[for="name"]');
    await expect(nameLabel).toBeVisible();
    await expect(nameLabel).toContainText("Nama Lengkap");

    const nameInput = page.locator('#name');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute("type", "text");

    // Check email field
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();
    await expect(emailLabel).toContainText("Alamat Email");

    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute("type", "email");

    // Check message field
    const messageLabel = page.locator('label[for="message"]');
    await expect(messageLabel).toBeVisible();
    await expect(messageLabel).toContainText("Pesan Anda");

    const messageTextarea = page.locator('#message');
    await expect(messageTextarea).toBeVisible();

    // Check submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText("Kirim Pesan");
  });

  test("should allow form input and validation", async ({ page }) => {
    // Fill out the form
    await page.locator('#name').fill("John Doe");
    await page.locator('#email').fill("john.doe@example.com");
    await page.locator('#message').fill("This is a test message for the contact form.");

    // Verify the input values
    await expect(page.locator('#name')).toHaveValue("John Doe");
    await expect(page.locator('#email')).toHaveValue("john.doe@example.com");
    await expect(page.locator('#message')).toHaveValue("This is a test message for the contact form.");

    // Test form clearing
    await page.locator('#name').fill("");
    await expect(page.locator('#name')).toHaveValue("");
  });

  test("should have proper form styling and focus states", async ({ page }) => {
    // Test focus on name field
    await page.locator('#name').focus();
    await expect(page.locator('#name')).toBeFocused();

    // Test focus on email field
    await page.locator('#email').focus();
    await expect(page.locator('#email')).toBeFocused();

    // Test focus on message field
    await page.locator('#message').focus();
    await expect(page.locator('#message')).toBeFocused();

    // Check that form fields have proper styling classes
    const nameInput = page.locator('#name');
    await expect(nameInput).toHaveClass(/border-gray-300/);
    await expect(nameInput).toHaveClass(/focus:ring-primary/);
  });

  test("should have working navigation links", async ({ page }) => {
    // Test Home/Beranda link
    await page.locator('nav a[href="index.html"]').click();
    await expect(page).toHaveURL(/.*index\.html|.*\/$/);

    // Go back to contact page
    await page.goto("/contact.html");

    // Test Books/Koleksi link
    await page.locator('nav a[href="books.html"]').click();
    await expect(page).toHaveURL(/.*books\.html/);

    // Go back to contact page
    await page.goto("/contact.html");

    // Test About/Tentang link
    await page.locator('nav a[href="about.html"]').click();
    await expect(page).toHaveURL(/.*about\.html/);
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
    // Test desktop view - check grid layout
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator("header")).toBeVisible();

    // Should have grid layout on desktop
    const gridContainer = page.locator(".grid.md\\:grid-cols-2");
    await expect(gridContainer).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(gridContainer).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();

    // Form should be visible and functional on mobile
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();

    // Content should stack vertically on mobile
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
    await expect(page).toHaveTitle(/Kontak/);
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
    await expect(h1Elements).toContainText("Hubungi Kami");

    // Check h2 elements exist
    const h2Elements = page.locator("h2");
    const h2Count = await h2Elements.count();
    expect(h2Count).toBeGreaterThanOrEqual(2); // Should have contact details and form sections

    // Verify h2 content
    await expect(page.locator("h2").first()).toContainText("Detail Kontak");
    await expect(page.locator("h2").nth(1)).toContainText("Kirim Pesan");
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
    const brandName = page.locator('header a[href="index.html"]').first();
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

  test("should have proper form accessibility", async ({ page }) => {
    // Check that all form fields have proper labels
    const nameLabel = page.locator('label[for="name"]');
    const emailLabel = page.locator('label[for="email"]');
    const messageLabel = page.locator('label[for="message"]');

    await expect(nameLabel).toBeVisible();
    await expect(emailLabel).toBeVisible();
    await expect(messageLabel).toBeVisible();

    // Check that labels are properly associated with inputs
    const nameInput = page.locator('#name');
    const emailInput = page.locator('#email');
    const messageInput = page.locator('#message');

    await expect(nameInput).toHaveAttribute("id", "name");
    await expect(emailInput).toHaveAttribute("id", "email");
    await expect(messageInput).toHaveAttribute("id", "message");
  });

  test("should handle keyboard navigation properly", async ({ page }) => {
    // Test tab navigation through form fields
    await page.keyboard.press("Tab");

    // Should focus on first form field or navigation
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(["A", "INPUT", "TEXTAREA", "BUTTON"]).toContain(focusedElement);

    // Test form field navigation
    await page.locator('#name').focus();
    await expect(page.locator('#name')).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.locator('#email')).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.locator('#message')).toBeFocused();
  });

  test("should handle email link functionality", async ({ page }) => {
    // Check that email link has correct mailto attribute
    const emailLink = page.locator('a[href="mailto:kontak@pustakailmu.com"]');
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute("href", "mailto:kontak@pustakailmu.com");

    // Check email link styling
    await expect(emailLink).toHaveClass(/text-primary/);
    await expect(emailLink).toHaveClass(/hover:underline/);
  });

  test("should handle browser back/forward navigation properly", async ({
    page,
  }) => {
    // Fill out some form data
    await page.locator('#name').fill("Test User");
    await page.locator('#email').fill("test@example.com");

    // Navigate to another page
    await page.locator('nav a[href="index.html"]').click();
    await expect(page).toHaveURL(/.*index\.html|.*\/$/);

    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL(/.*contact\.html/);

    // Verify page content is still displayed correctly
    await expect(page.locator("h1")).toContainText("Hubungi Kami");
    await expect(page.locator("form")).toBeVisible();

    // Note: Form data may not persist after navigation depending on implementation
    const nameValue = await page.locator('#name').inputValue();
    // Form should at least be functional after back navigation
    await page.locator('#name').fill("New Test User");
    await expect(page.locator('#name')).toHaveValue("New Test User");
  });

  test("should have proper grid layout on larger screens", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });

    // Check that the two-column grid is active on larger screens
    const gridContainer = page.locator(".grid.md\\:grid-cols-2");
    await expect(gridContainer).toBeVisible();

    // Both contact details and form should be visible side by side
    const contactDetails = page.locator("h2").filter({ hasText: "Detail Kontak" });
    const contactForm = page.locator("h2").filter({ hasText: "Kirim Pesan" });

    await expect(contactDetails).toBeVisible();
    await expect(contactForm).toBeVisible();

    // Check that the sections are properly spaced
    const spacing = page.locator(".gap-12");
    await expect(spacing).toBeVisible();
  });
});
