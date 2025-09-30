#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Comprehensive test configuration - all page tests
const allPageTests = [
  'homepage.spec.js',
  'books-page.spec.js',
  'about-page.spec.js',
  'contact-page.spec.js',
  'api-integration.spec.js'
];

// Cross-browser tests
const crossBrowserTests = [
  'cross-browser.spec.js'
];

// Only test on Chromium for speed in quick mode
const browser = process.argv.includes('--full') ? ['chromium', 'firefox'] : ['chromium'];

console.log('🚀 Running Comprehensive Playwright Tests...\n');
console.log('📋 Test Configuration:');
console.log(`   Browser(s): ${browser.join(', ')}`);
console.log(`   Page Tests: ${allPageTests.join(', ')}`);
if (process.argv.includes('--full')) {
  console.log(`   Cross-browser Tests: ${crossBrowserTests.join(', ')}`);
}
console.log('─'.repeat(60));

// Build the command
let testPattern;
if (process.argv.includes('--full')) {
  // Run all tests including cross-browser
  testPattern = [...allPageTests, ...crossBrowserTests].join('|');
} else {
  // Run only page-specific tests
  testPattern = allPageTests.join('|');
}

const command = 'npx';
const args = [
  'playwright',
  'test',
  '--grep',
  `(${testPattern})`,
  '--reporter',
  'list'
];

// Add browser projects
browser.forEach(b => {
  args.push('--project', b);
});

// Run the tests
const testProcess = spawn(command, args, {
  stdio: 'inherit',
  cwd: process.cwd()
});

testProcess.on('close', (code) => {
  console.log('\n' + '─'.repeat(60));

  if (code === 0) {
    console.log('✅ All page tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✓ Homepage functionality');
    console.log('   ✓ Books collection page');
    console.log('   ✓ About page content');
    console.log('   ✓ Contact page and form');
    console.log('   ✓ API integration');
    if (process.argv.includes('--full')) {
      console.log('   ✓ Cross-browser compatibility');
    }

    console.log('\n💡 Available commands:');
    console.log('   npm run test:all-pages     # Quick test (Chromium only)');
    console.log('   npm run test:all-pages:full # Full test (all browsers)');
    console.log('   npm test                   # Complete test suite');
    console.log('   npm run test:report        # View detailed HTML report');
  } else {
    console.log('❌ Some tests failed. Exit code:', code);
    console.log('\n🔍 For detailed debugging:');
    console.log('   npm run test:debug');
    console.log('\n🎭 To run with UI mode:');
    console.log('   npm run test:ui');
    console.log('\n📊 To view test report:');
    console.log('   npm run test:report');
  }

  process.exit(code);
});

testProcess.on('error', (error) => {
  console.error('❌ Failed to start test process:', error);
  console.error('\n💡 Make sure you have installed dependencies:');
  console.error('   npm install');
  console.error('   npm run install:browsers');
  process.exit(1);
});
