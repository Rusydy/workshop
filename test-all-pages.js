#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

// Comprehensive test configuration for PHP/Bootstrap/MySQL version
const allPageTests = [
  "homepage.spec.js",
  "books-page.spec.js",
  "about-page.spec.js",
  "contact-page.spec.js",
  "api-integration.spec.js",
];

// Cross-browser tests
const crossBrowserTests = ["cross-browser.spec.js"];

// Only test on Chromium for speed in quick mode
const browser = process.argv.includes("--full")
  ? ["chromium", "firefox"]
  : ["chromium"];

console.log(
  "🚀 Running Comprehensive Playwright Tests for PHP/Bootstrap Version...\n",
);
console.log("📋 Test Configuration:");
console.log(`   Stack: PHP + Bootstrap + MySQL`);
console.log(`   Server: PHP built-in server (localhost:8000)`);
console.log(`   Browser(s): ${browser.join(", ")}`);
console.log(`   Page Tests: ${allPageTests.join(", ")}`);
if (process.argv.includes("--full")) {
  console.log(`   Cross-browser Tests: ${crossBrowserTests.join(", ")}`);
}
console.log("─".repeat(70));

// Build the command
let testPattern;
if (process.argv.includes("--full")) {
  // Run all tests including cross-browser
  testPattern = [...allPageTests, ...crossBrowserTests].join("|");
} else {
  // Run only page-specific tests
  testPattern = allPageTests.join("|");
}

const command = "npx";
const args = [
  "playwright",
  "test",
  "--grep",
  `(${testPattern})`,
  "--reporter",
  "list",
];

// Add browser projects
browser.forEach((b) => {
  args.push("--project", b);
});

// Run the tests
const testProcess = spawn(command, args, {
  stdio: "inherit",
  cwd: process.cwd(),
});

testProcess.on("close", (code) => {
  console.log("\n" + "─".repeat(70));

  if (code === 0) {
    console.log("✅ All PHP/Bootstrap page tests passed successfully!");
    console.log("\n📊 Test Summary:");
    console.log("   ✓ Homepage functionality (PHP + MySQL)");
    console.log("   ✓ Books collection page (Database integration)");
    console.log("   ✓ About page content (Bootstrap styling)");
    console.log("   ✓ Contact page and form (PHP form handling)");
    console.log("   ✓ API integration (Cart + Database)");
    if (process.argv.includes("--full")) {
      console.log("   ✓ Cross-browser compatibility");
    }

    console.log("\n🎯 Key Features Tested:");
    console.log("   📚 MySQL database connection and book loading");
    console.log("   🛒 PHP session-based cart functionality");
    console.log("   📝 Contact form with server-side validation");
    console.log("   📱 Bootstrap responsive design");
    console.log("   🔒 Security (XSS prevention, SQL injection protection)");

    console.log("\n💡 Available commands:");
    console.log("   npm run test:all-pages     # Quick test (Chromium only)");
    console.log("   npm run test:all-pages:full # Full test (all browsers)");
    console.log("   npm test                   # Complete test suite");
    console.log("   npm run test:report        # View detailed HTML report");
    console.log("   npm run setup              # Setup database");
    console.log("   npm run dev                # Start PHP server");
  } else {
    console.log("❌ Some tests failed. Exit code:", code);
    console.log("\n🔍 For detailed debugging:");
    console.log("   npm run test:debug");
    console.log("\n🎭 To run with UI mode:");
    console.log("   npm run test:ui");
    console.log("\n📊 To view test report:");
    console.log("   npm run test:report");

    console.log("\n🚨 Common issues to check:");
    console.log("   1. Is MySQL/MariaDB running on port 3316?");
    console.log('   2. Is the database "db_stik" created?');
    console.log("   3. Run: npm run setup (to initialize database)");
    console.log("   4. Is PHP server running? (npm run dev)");
    console.log("   5. Are all dependencies installed? (npm install)");
  }

  process.exit(code);
});

testProcess.on("error", (error) => {
  console.error("❌ Failed to start test process:", error);
  console.error("\n💡 Make sure you have installed dependencies:");
  console.error("   npm install");
  console.error("   npm run install:browsers");
  console.error("\n🗄️ Make sure database is set up:");
  console.error("   npm run setup");
  console.error("\n🖥️ Make sure PHP server is configured:");
  console.error("   npm run dev");
  process.exit(1);
});
