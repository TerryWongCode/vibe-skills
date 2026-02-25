---
name: twitter-browse
description: Browse timelines and search tweets on X.com (Twitter) using Chrome DevTools Protocol. Use when users want you to extract tweets from the "For you" timeline or search for specific topics. Requires Chrome running with remote debugging on port 9222.
---

# Twitter Browse

Browse and search tweets on X.com (Twitter) using Chrome DevTools Protocol (CDP) automation.

## When to Use

Use this skill when the user wants to:
- Retrieve recent tweets from the "For you" timeline to create a brief
- Search for specific topics (e.g. "AIGC tools", "big techs") on X.com
- Extract text content from tweets for summarization

## Prerequisites

1. **Chrome with Remote Debugging**: Chrome must be running with `--remote-debugging-port=9222`
2. **X.com Login**: User must be logged in to X.com in the Chrome browser
3. **playwright-core**: Node.js package for CDP automation

## Setup Instructions

### 1. Start Chrome with Remote Debugging

**macOS/Linux:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

**Windows:**
```powershell
chrome.exe --remote-debugging-port=9222
```

### 2. Log in to X.com

Open Chrome and go to https://x.com and log in to your account.

### 3. Install Dependencies

```bash
npm install playwright-core
```

## Usage

To browse the "For you" timeline:

```bash
node scripts/browse-x.js
```

To search for a specific topic:

```bash
node scripts/browse-x.js "Your search topic here"
```

**Arguments:**
- `[search-topic]`: The topic to search for (optional)
- `[pages]`: The number of pages (scrolls) to load (optional, default: 5). Must be the last argument if provided.

**Examples:**

```bash
# Browse "For you" timeline
node scripts/browse-x.js

# Search for a topic
node scripts/browse-x.js "AIGC tools"

# Browse 20 pages of the "For you" timeline
node scripts/browse-x.js 20

# Search for a topic and load 10 pages
node scripts/browse-x.js "AIGC tools" 10
```

## Features

- ✅ **Timeline Browsing**: Extracts top recommended threads from the home timeline
- ✅ **Topic Search**: Searches for specific queries and extracts top results
- ✅ **Automatic Scrolling**: Scrolls organically to load more tweets
- ✅ **Content Extraction**: Extracts tweet text and authors

## Workflow

When a user requests to browse tweets or summarize a topic:

1. **Check Chrome CDP**: Verify Chrome is accessible on port 9222
2. **Check X.com login**: Confirm user is logged in
3. **Run browse script**: Execute with or without the search topic
4. **Read Output**: Parse the stdout to get the extracted tweets
5. **Summarize**: Create a brief based on the extracted tweets and present to the user

## How It Works

1. Connects to Chrome via CDP on port 9222
2. Navigates to `https://x.com/home` (if no topic) or `https://x.com/search?q={topic}&f=top`
3. Waits for timeline to render and scrolls to load more tweets
4. Evaluates the DOM to extract text from `article` elements
5. Prints the extracted data to standard output

## Technical Details

- Uses Playwright Core for CDP automation
- Targets standard X.com data-testids (`tweet`, `tweetText`, `User-Name`)
- Handles X.com React rendering delays
- Auto-dismisses any dialogs that might block the process

## Troubleshooting

**"No browser contexts found" error:**
- Make sure Chrome is running with `--remote-debugging-port=9222`
- Check that Chrome wasn't started with other debugging flags

**Zero tweets extracted:**
- Ensure you're logged in to X.com
- Playwright might have issues finding the DOM elements if X.com alters their classes or `data-testid`s. Review DOM structure if it breaks.

**Rate Limits:**
If X.com rate limits the scraping, the script might fail to load results. It is recommended to add wait times between runs.
