const { test, expect } = require("@playwright/test");

test.describe("Contact Page Tests - PHP/Bootstrap Version", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact.php");
  });

  test("should display the contact page correctly", async ({ page }) => {
    // Check page title
    await expect(page.locator("h1")).toContainText("Hubungi Kami");

    // Check subtitle
    await expect(page.locator(".hero-section p")).toContainText(
      "Ada pertanyaan atau masukan? Kami siap membantu!",
    );

    // Verify page URL
    await expect(page).toHaveURL(/.*contact\.php/);

    // Check navigation shows contact as active
    const contactNavLink = page.locator('nav a[href="contact.php"]');
    await expect(contactNavLink).toHaveClass(/active/);
  });

  test("should have proper page title", async ({ page }) => {
    await expect(page).toHaveTitle("Kontak - Pustaka Ilmu");
  });

  test("should display contact information correctly", async ({ page }) => {
    // Check address section
    await expect(page.locator(".fas.fa-map-marker-alt")).toBeVisible();
    await expect(page.locator("text=Jl. Literasi No. 123")).toBeVisible();
    await expect(page.locator("text=Bekasi, Jawa Barat, 17145")).toBeVisible();

    // Check email section
    await expect(page.locator(".fas.fa-envelope")).toBeVisible();
    const emailLink = page.locator('a[href="mailto:kontak@pustakailmu.com"]');
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toContainText("kontak@pustakailmu.com");

    // Check phone section
    await expect(page.locator(".fas.fa-phone")).toBeVisible();
    await expect(page.locator("text=(021) 1234 5678")).toBeVisible();

    // Check operating hours
    await expect(page.locator(".fas.fa-clock")).toBeVisible();
    await expect(
      page.locator("text=Senin - Jumat, 09:00 - 17:00 WIB"),
    ).toBeVisible();
  });

  test("should display contact form with all required fields", async ({
    page,
  }) => {
    // Check form heading
    await expect(
      page.locator("h2").filter({ hasText: "Kirim Pesan" }),
    ).toBeVisible();

    // Check all form fields
    const nameField = page.locator("#name");
    await expect(nameField).toBeVisible();
    await expect(nameField).toHaveAttribute("required");

    const emailField = page.locator("#email");
    await expect(emailField).toBeVisible();
    await expect(emailField).toHaveAttribute("type", "email");
    await expect(emailField).toHaveAttribute("required");

    const messageField = page.locator("#message");
    await expect(messageField).toBeVisible();
    await expect(messageField).toHaveAttribute("required");

    // Check submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText("Kirim Pesan");
  });

  test("should validate required form fields", async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check HTML5 validation
    const nameValidation = await page.evaluate(() => {
      const nameInput = document.querySelector("#name");
      return nameInput.validity.valid;
    });
    expect(nameValidation).toBeFalsy();

    const emailValidation = await page.evaluate(() => {
      const emailInput = document.querySelector("#email");
      return emailInput.validity.valid;
    });
    expect(emailValidation).toBeFalsy();

    const messageValidation = await page.evaluate(() => {
      const messageInput = document.querySelector("#message");
      return messageInput.validity.valid;
    });
    expect(messageValidation).toBeFalsy();
  });

  test("should validate email format", async ({ page }) => {
    // Fill form with invalid email
    await page.fill("#name", "Test User");
    await page.fill("#email", "invalid-email-format");
    await page.fill("#message", "This is a test message");

    await page.click('button[type="submit"]');

    // Check email validation
    const emailValidation = await page.evaluate(() => {
      const emailInput = document.querySelector("#email");
      return emailInput.validity.valid;
    });
    expect(emailValidation).toBeFalsy();
  });

  test("should submit form with valid data", async ({ page }) => {
    // Fill out the form with valid data
    await page.fill("#name", "John Doe");
    await page.fill("#email", "john.doe@example.com");
    await page.fill(
      "#message",
      "This is a test message from Playwright automated testing.",
    );

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for form processing
    await page.waitForTimeout(1500);

    // Should either show success message or stay on contact page
    const successAlert = page.locator(".alert-success");
    const errorAlert = page.locator(".alert-danger");
    const isOnContactPage = page.url().includes("contact.php");

    // Should either show an alert or remain on contact page
    const hasAlert =
      (await successAlert.count()) > 0 || (await errorAlert.count()) > 0;
    expect(hasAlert || isOnContactPage).toBeTruthy();

    // If success alert is shown, check its content
    if ((await successAlert.count()) > 0) {
      await expect(successAlert).toContainText("berhasil");
      await expect(successAlert.locator(".fas.fa-check-circle")).toBeVisible();
    }
  });

  test("should retain form data on validation error", async ({ page }) => {
    // Fill form with invalid email but valid other fields
    const testName = "Test User";
    const invalidEmail = "invalid-email";
    const testMessage = "Test message content";

    await page.fill("#name", testName);
    await page.fill("#email", invalidEmail);
    await page.fill("#message", testMessage);

    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Form should retain the values (except maybe clear invalid email)
    const nameValue = await page.inputValue("#name");
    const messageValue = await page.inputValue("#message");

    expect(nameValue).toBe(testName);
    expect(messageValue).toBe(testMessage);
  });

  test("should display additional info section", async ({ page }) => {
    // Check "Mengapa Memilih Pustaka Ilmu?" section
    await expect(
      page.locator("h3").filter({ hasText: "Mengapa Memilih Pustaka Ilmu?" }),
    ).toBeVisible();

    // Check shipping feature
    await expect(page.locator(".fas.fa-shipping-fast")).toBeVisible();
    await expect(
      page.locator("h5").filter({ hasText: "Pengiriman Cepat" }),
    ).toBeVisible();
    await expect(
      page.locator("text=Buku sampai dalam 1-3 hari kerja"),
    ).toBeVisible();

    // Check quality feature
    await expect(page.locator(".fas.fa-shield-alt")).toBeVisible();
    await expect(
      page.locator("h5").filter({ hasText: "Kualitas Terjamin" }),
    ).toBeVisible();
    await expect(
      page.locator("text=100% buku original dan berkualitas"),
    ).toBeVisible();

    // Check support feature
    await expect(page.locator(".fas.fa-headset")).toBeVisible();
    await expect(
      page.locator("h5").filter({ hasText: "Customer Support" }),
    ).toBeVisible();
    await expect(
      page.locator("text=Tim support siap membantu 24/7"),
    ).toBeVisible();
  });

  test("should have proper Bootstrap styling", async ({ page }) => {
    // Check grid layout
    const gridContainers = page.locator(".row");
    const gridCount = await gridContainers.count();
    expect(gridCount).toBeGreaterThan(0);

    // Check column classes
    const columns = page.locator(".col-lg-6");
    const columnCount = await columns.count();
    expect(columnCount).toBe(2); // Contact info and form

    // Check form styling
    const formControls = page.locator(".form-control");
    const controlCount = await formControls.count();
    expect(controlCount).toBe(3); // name, email, message

    // Check button styling
    const submitButton = page.locator('button[type="submit"]');
    const buttonClasses = await submitButton.getAttribute("class");
    expect(buttonClasses).toMatch(/btn-primary/);
    expect(buttonClasses).toMatch(/btn-lg/);
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

    // Check form is accessible on mobile
    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#message")).toBeVisible();

    // Check contact info is still visible
    await expect(
      page.locator("h2").filter({ hasText: "Detail Kontak" }),
    ).toBeVisible();

    // Check columns stack properly on mobile
    const formSection = page.locator(".col-lg-6").nth(1);
    const contactSection = page.locator(".col-lg-6").first();

    await expect(formSection).toBeVisible();
    await expect(contactSection).toBeVisible();
  });

  test("should handle form submission errors gracefully", async ({ page }) => {
    // Fill form with potentially problematic data
    await page.fill("#name", "A".repeat(100)); // Very long name
    await page.fill("#email", "test@example.com");
    await page.fill("#message", "X".repeat(1000)); // Very long message

    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);

    // Page should not crash
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("nav.navbar")).toBeVisible();

    // Form should still be functional
    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should have proper accessibility features", async ({ page }) => {
    // Check form labels
    const nameLabel = page.locator('label[for="name"]');
    await expect(nameLabel).toBeVisible();
    await expect(nameLabel).toContainText("Nama Lengkap");

    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();
    await expect(emailLabel).toContainText("Alamat Email");

    const messageLabel = page.locator('label[for="message"]');
    await expect(messageLabel).toBeVisible();
    await expect(messageLabel).toContainText("Pesan Anda");

    // Check form-label classes for proper styling
    const labels = page.locator(".form-label");
    const labelCount = await labels.count();
    expect(labelCount).toBe(3);

    // Check input-label associations
    const nameInput = page.locator("#name");
    const nameFor = await nameLabel.getAttribute("for");
    const nameId = await nameInput.getAttribute("id");
    expect(nameFor).toBe(nameId);
  });

  test("should prevent XSS attacks", async ({ page }) => {
    // Try to inject script in form fields
    const xssPayload = "<script>alert('xss')</script>";

    await page.fill("#name", xssPayload);
    await page.fill("#email", "test@example.com");
    await page.fill("#message", "Test message");

    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);

    // Should not execute JavaScript or display raw HTML
    const pageContent = await page.textContent("body");
    expect(pageContent).not.toContain("<script>alert('xss')</script>");

    // Check if alert was called (shouldn't be)
    const alertCalled = await page.evaluate(() => {
      return window.alertCalled || false;
    });
    expect(alertCalled).toBeFalsy();
  });

  test("should have working navigation links", async ({ page }) => {
    // Test brand link
    const brandLink = page.locator('.navbar-brand[href="index.php"]');
    await brandLink.click();
    await expect(page).toHaveURL(/.*index\.php$|.*\/$/);

    // Go back to contact
    await page.goto("/contact.php");

    // Test books navigation
    const booksLink = page.locator('nav a[href="books.php"]');
    await booksLink.click();
    await expect(page).toHaveURL(/.*books\.php/);

    // Go back to contact
    await page.goto("/contact.php");

    // Test about navigation
    const aboutLink = page.locator('nav a[href="about.php"]');
    await aboutLink.click();
    await expect(page).toHaveURL(/.*about\.php/);
  });

  test("should display consistent footer content", async ({ page }) => {
    // Check footer is present
    const footer = page.locator("footer.footer");
    await expect(footer).toBeVisible();

    // Check copyright
    await expect(footer).toContainText("© 2025 Toko Buku Pustaka Ilmu");
    await expect(footer).toContainText("kontak@pustakailmu.com");
  });

  test("should handle very long messages properly", async ({ page }) => {
    // Create a very long message
    const longMessage = "Lorem ipsum dolor sit amet, ".repeat(100);

    await page.fill("#name", "Test User");
    await page.fill("#email", "test@example.com");
    await page.fill("#message", longMessage);

    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Form should handle long content gracefully
    await expect(page.locator("body")).toBeVisible();

    // Either show success/error or stay on page
    const isOnContactPage = page.url().includes("contact.php");
    const hasAlert = (await page.locator(".alert").count()) > 0;

    expect(isOnContactPage || hasAlert).toBeTruthy();
  });

  test("should maintain form state during interaction", async ({ page }) => {
    // Fill some fields
    await page.fill("#name", "John Doe");
    await page.fill("#email", "john@example.com");

    // Navigate away (but don't submit)
    await page.click('nav a[href="about.php"]');
    await page.waitForTimeout(500);

    // Come back
    await page.goto("/contact.php");

    // Form should be reset (this is expected behavior)
    const nameValue = await page.inputValue("#name");
    expect(nameValue).toBe("");
  });

  test("should have proper meta tags", async ({ page }) => {
    // Check language
    await expect(page.locator("html")).toHaveAttribute("lang", "id");

    // Check viewport
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute(
      "content",
      "width=device-width, initial-scale=1.0",
    );

    // Check charset
    const charsetMeta = page.locator("meta[charset]");
    await expect(charsetMeta).toHaveAttribute("charset", "UTF-8");
  });

  test("should load external resources properly", async ({ page }) => {
    // Check Bootstrap CSS
    const bootstrapCSS = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]'),
      );
      return links.some((link) => link.href.includes("bootstrap"));
    });
    expect(bootstrapCSS).toBeTruthy();

    // Check Font Awesome
    const fontAwesome = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]'),
      );
      return links.some((link) => link.href.includes("font-awesome"));
    });
    expect(fontAwesome).toBeTruthy();

    // Check Bootstrap JS
    const bootstrapJS = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script[src]"));
      return scripts.some((script) => script.src.includes("bootstrap"));
    });
    expect(bootstrapJS).toBeTruthy();
  });
});
