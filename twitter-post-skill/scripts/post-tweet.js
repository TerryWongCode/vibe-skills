#!/usr/bin/env node

/**
 * Post a tweet to X.com (Twitter) using Chrome CDP
 * Usage: node post-tweet.js "Your tweet text here"
 */

const playwright = require('playwright-core');

// Get tweet text from command line argument
const TWEET_TEXT = process.argv[2];

if (!TWEET_TEXT) {
  console.error('Usage: node post-tweet.js "Your tweet text here"');
  console.error('\nExample:');
  console.error('  node post-tweet.js "Hello, Twitter!"');
  process.exit(1);
}

// Check character count
const charCount = TWEET_TEXT.length;
console.log(`📝 Tweet length: ${charCount} characters`);

if (charCount > 280) {
  console.warn(`⚠️  Warning: Tweet is ${charCount - 280} characters over the 280 limit`);
  console.warn('   X.com may reject this tweet or truncate it');
}

async function postTweet() {
  console.log('🔗 Connecting to Chrome on port 9222...');

  try {
    const browser = await playwright.chromium.connectOverCDP('http://localhost:9222');
    const context = browser.contexts()[0];

    if (!context) {
      throw new Error('No browser contexts found. Make sure Chrome is running with --remote-debugging-port=9222');
    }

    // Handle dialogs automatically
    context.on('dialog', dialog => {
      console.log(`📝 Auto-dismissing dialog: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });

    const pages = context.pages();
    const page = pages.find(p => p.url().includes('x.com') || p.url().includes('twitter.com'));

    if (!page) {
      console.log('📖 Opening X.com in new tab...');
      const newPage = await context.newPage();
      await newPage.goto('https://x.com/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
      return postToPage(newPage);
    } else {
      console.log('✓ Found existing X.com tab');
      await page.bringToFront();
      return postToPage(page);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Start Chrome with: chrome --remote-debugging-port=9222');
    console.error('2. Make sure you are logged in to X.com');
    console.error('3. Check that port 9222 is not blocked by firewall');
    process.exit(1);
  }
}

async function postToPage(page) {
  console.log('📍 Navigating to X.com home...');

  const currentUrl = page.url();
  if (!currentUrl.includes('x.com/home')) {
    await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
  }

  await page.waitForTimeout(2000);

  // Close any existing dialogs
  console.log('🧹 Closing any existing dialogs...');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  console.log('🔍 Opening compose dialog...');

  // Click compose button
  const composeSelectors = [
    'a[data-testid="SideNav_NewTweet_Button"]',
    'a[aria-label="Post"]',
  ];

  let clicked = false;
  for (const selector of composeSelectors) {
    try {
      await page.click(selector, { timeout: 3000 });
      clicked = true;
      console.log('✓ Compose dialog opened');
      break;
    } catch (e) {
      // Try next selector
    }
  }

  if (!clicked) {
    throw new Error('Could not open compose dialog. Make sure you are logged in to X.com');
  }

  await page.waitForTimeout(1500);

  console.log('📝 Finding text area...');

  // Find the text area
  const textAreaSelector = 'div[data-testid="tweetTextarea_0"]';
  const textArea = await page.waitForSelector(textAreaSelector, { timeout: 5000 });

  console.log('✓ Found text area');

  // Click to focus
  await textArea.click();
  await page.waitForTimeout(300);

  console.log('⌨️  Entering tweet text...');

  // Clear any existing text
  await page.keyboard.press('Meta+A');
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);

  // Type the text character by character (slower but more reliable)
  for (const char of TWEET_TEXT) {
    await page.keyboard.type(char);
    await page.waitForTimeout(5); // Small delay between characters
  }

  console.log('✓ Text entered');
  await page.waitForTimeout(1500);

  console.log('🚀 Posting tweet using keyboard shortcut (Cmd+Enter)...');

  // Use keyboard shortcut Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
  await page.keyboard.press('Meta+Enter');

  await page.waitForTimeout(3000);

  console.log('\n✅ Tweet posted successfully!');
  console.log('🔗 View at: https://x.com/home');
  console.log('\n📱 Tweet content:');
  console.log('─'.repeat(50));
  console.log(TWEET_TEXT);
  console.log('─'.repeat(50));
}

postTweet();
