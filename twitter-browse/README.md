# Twitter Browse Skill

A Claude/Gemini Code skill for automated browsing, searching, and extracting tweets from X.com (Twitter) using Chrome DevTools Protocol (CDP).

## Overview

This skill allows Claude/Gemini to connect to your existing Chrome browser, navigate to X.com, and extract tweets from your "For you" timeline or specific search queries. This enables the AI to act as your research assistant on Twitter, summarizing trending topics or your personal feed.

## Features

- **Timeline Browsing**: Extracts top recommended threads from the home timeline
- **Topic Search**: Searches for specific queries and extracts top results
- **Automatic Scrolling**: Scrolls organically to load more tweets
- **Content Extraction**: Extracts tweet text and authors

## Prerequisites

1. **Google Chrome**: Must be installed on your system
2. **Node.js**: v14 or higher
3. **X.com Account**: You must be logged in to X.com in Chrome

## Setup Instructions

### 1. Start Chrome with Remote Debugging

You need to start a special instance of Chrome that allows tools to connect to it.

**macOS/Linux:**
Open terminal and run:
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

**Windows:**
Open Command Prompt/PowerShell and run:
```powershell
chrome.exe --remote-debugging-port=9222
```

> **Note:** Make sure all normal Chrome windows are closed before running this command, otherwise it might just open a new window in your existing session without debugging enabled.

### 2. Log in to X.com

1. In the Chrome window that opens, go to [https://x.com](https://x.com)
2. Log in to your account
3. Ensure you can see your timeline

### 3. Install Dependencies

In your project directory, install the required packages:

```bash
npm install
```

## Usage

This skill is designed to be used by Claude/Gemini, but you can also test it manually.

### For AI Agents

Just ask Claude/Gemini to:
- "Check my for you timeline on Twitter and give me a summary"
- "Search Twitter for 'AIGC tools' and brief me on what people are saying"

### Manual Testing

You can run the script manually from the command line:

```bash
# Browse your "For you" timeline
npm run browse

# Or run the script directly:
node scripts/browse-x.js

# Search for a topic
node scripts/browse-x.js "big techs"

# Browse 20 pages of your "For you" timeline
node scripts/browse-x.js 20

# Search for a topic and load 10 pages
node scripts/browse-x.js "big techs" 10
```

## How It Works

1. The script uses Playwright to connect to your running Chrome instance on port 9222
2. It navigates to the X.com timeline or search page
3. It waits for the React application to render the tweets
4. It scrolls down slightly to load more content
5. It extracts text and author information from the standard X.com UI elements
6. It outputs the structured data to the console

## Troubleshooting

### "No browser contexts found" error
Chrome is not running with the remote debugging port open. Make sure you fully quit Chrome and launch it using the commands above.

### Screen stays on a blank page or no tweets extracted
- Check if you are correctly logged in to X.com in that Chrome instance.
- Twitter occasionally changes its DOM structure. If the `data-testid` selectors stop working, the `scripts/browse-x.js` file may need updating.

### "Playwright error" or connection refused
Make sure nothing else is using port 9222 on your machine.

## License

MIT
