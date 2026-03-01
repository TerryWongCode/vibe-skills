#!/usr/bin/env node

/**
 * Browse tweets on X.com (Twitter) using Chrome CDP
 * Usage: node browse-x.js [topic]
 * If [topic] is provided, it searches for it. Otherwise, it browses the "For you" timeline.
 */

const playwright = require('playwright-core');

// Get search query and target tweet count from command line arguments (optional)
const args = process.argv.slice(2);
let SEARCH_QUERY = '';
let TARGET_COUNT = 20; // default: collect 20 tweets
const MAX_SCROLLS = 200; // safety cap to avoid infinite loops

if (args.length > 0) {
    const lastArg = args[args.length - 1];
    if (/^\d+$/.test(lastArg)) {
        TARGET_COUNT = parseInt(lastArg, 10);
        SEARCH_QUERY = args.slice(0, -1).join(' ');
    } else {
        SEARCH_QUERY = args.join(' ');
    }
}

async function browseX() {
    console.log('🔗 Connecting to Chrome on port 9222...');

    try {
        const browser = await playwright.chromium.connectOverCDP('http://localhost:9222');
        const context = browser.contexts()[0];

        if (!context) {
            throw new Error('No browser contexts found. Make sure Chrome is running with --remote-debugging-port=9222');
        }

        // Handle dialogs automatically
        context.on('dialog', dialog => {
            dialog.dismiss().catch(() => { });
        });

        const pages = context.pages();
        const page = pages.find(p => p.url().includes('x.com') || p.url().includes('twitter.com'));

        let targetUrl;
        if (SEARCH_QUERY) {
            const encodedQuery = encodeURIComponent(SEARCH_QUERY);
            targetUrl = `https://x.com/search?q=${encodedQuery}&f=top`;
            console.log(`🔍 Planning to search for: "${SEARCH_QUERY}"`);
        } else {
            targetUrl = 'https://x.com/home';
            console.log(`🏠 Planning to browse the "For you" timeline`);
        }

        if (!page) {
            console.log(`📖 Opening X.com in new tab...`);
            const newPage = await context.newPage();
            await newPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await extractTweets(newPage);
        } else {
            console.log('✓ Found existing X.com tab');
            await page.bringToFront();

            const currentUrl = page.url();
            if (!currentUrl.includes(targetUrl)) {
                console.log(`📍 Navigating to ${targetUrl}...`);
                await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            }

            await extractTweets(page);
        }

        // Exit gracefully
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Start Chrome with: chrome --remote-debugging-port=9222');
        console.error('2. Make sure you are logged in to X.com');
        console.error('3. Check that port 9222 is not blocked by firewall');
        process.exit(1);
    }
}

async function extractTweets(page) {
    console.log('⏳ Waiting for tweets to load...');

    // Wait a bit for React to render the timeline
    await page.waitForTimeout(4000);

    console.log(`📜 Scrolling until ${TARGET_COUNT} unique tweets are collected (max ${MAX_SCROLLS} scrolls)...`);

    const uniqueTweets = new Map();

    for (let i = 0; i < MAX_SCROLLS; i++) {
        try {
            // Extract what is currently visible
            const currentBatch = await page.evaluate(() => {
                const articles = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
                const results = [];

                for (const article of articles) {
                    const textElement = article.querySelector('div[data-testid="tweetText"]');
                    const authorElement = article.querySelector('div[data-testid="User-Name"]');

                    let text = textElement ? textElement.innerText : '[No text content / Media only]';
                    let author = authorElement ? authorElement.innerText.split('\n')[0] : 'Unknown';

                    // Extract tweet URL
                    let url = '';
                    const timeElement = article.querySelector('time');
                    if (timeElement && timeElement.parentElement && timeElement.parentElement.tagName === 'A') {
                        url = 'https://x.com' + timeElement.parentElement.getAttribute('href');
                    }

                    results.push({ author, text, url });
                }
                return results;
            });

            // Add to map to deduplicate (using a combination of author and text as key)
            for (const tweet of currentBatch) {
                const key = `${tweet.author}:::${tweet.text}`;
                if (!uniqueTweets.has(key)) {
                    uniqueTweets.set(key, tweet);
                }
            }
        } catch (error) {
            // Ignore execution context thrown when x.com React re-renders virtual list
            // console.log(`⚠️ Ignored context destruction error on scroll ${i}`);
        }

        // Stop once we have enough tweets
        if (uniqueTweets.size >= TARGET_COUNT) {
            console.log(`🎯 Reached target of ${TARGET_COUNT} tweets after ${i + 1} scrolls.`);
            break;
        }

        // Scroll down
        await page.mouse.wheel(0, 1000);
        await page.waitForTimeout(1500);
    }

    const allTweets = Array.from(uniqueTweets.values()).slice(0, TARGET_COUNT);

    if (allTweets.length === 0) {
        console.log('⚠️ No tweets found. Ensure you are logged in and the page loaded correctly.');
        return;
    }

    console.log(`\\n✅ Successfully extracted ${allTweets.length} unique tweets:\\n`);

    allTweets.forEach((tweet, index) => {
        console.log(`--- Tweet ${index + 1} ---`);
        console.log(`👤 Author: ${tweet.author}`);
        console.log(`🔗 URL: ${tweet.url || '(no url)'}`);
        console.log(`📝 Text:\\n${tweet.text}\\n`);
    });
}

browseX();
