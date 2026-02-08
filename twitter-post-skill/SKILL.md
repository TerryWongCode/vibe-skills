---
name: twitter-post
description: Post tweets to X.com (Twitter) using Chrome DevTools Protocol. Use when users want to post tweets, share content on Twitter/X, or automate social media posting. Requires Chrome running with remote debugging on port 9222.
---

# Twitter Post

Post tweets to X.com (Twitter) using Chrome DevTools Protocol (CDP) automation.

## When to Use

Use this skill when the user wants to:
- Post a tweet to X.com/Twitter
- Share content on social media
- Automate Twitter posting
- Publish social media updates

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

To post a tweet:

```bash
node .claude/skills/twitter-post/scripts/post-tweet.js "Your tweet text here"
```

**Arguments:**
- `<tweet-text>`: The text content of the tweet (required, max 280 characters)

**Examples:**

```bash
# Simple tweet
node .claude/skills/twitter-post/scripts/post-tweet.js "Hello, world!"

# Tweet with URL
node .claude/skills/twitter-post/scripts/post-tweet.js "Check out this article: https://example.com"

# Multi-line tweet (use quotes)
node .claude/skills/twitter-post/scripts/post-tweet.js "Line 1

Line 2

Line 3"
```

## Features

- ✅ **Keyboard Shortcut Posting**: Uses `Cmd+Enter` (Mac) or `Ctrl+Enter` (Windows/Linux) for reliable posting
- ✅ **Character-by-Character Typing**: Properly triggers X.com's React validation
- ✅ **Automatic Dialog Handling**: Dismisses any blocking dialogs
- ✅ **Error Recovery**: Handles common automation issues gracefully
- ✅ **280 Character Limit**: Validates tweet length before posting

## Workflow

When a user requests to post a tweet:

1. **Validate tweet length**: Ensure text is ≤280 characters
2. **Check Chrome CDP**: Verify Chrome is accessible on port 9222
3. **Check X.com login**: Confirm user is logged in
4. **Run post script**: Execute with the tweet text
5. **Confirm success**: Provide the user with confirmation

## How It Works

1. Connects to Chrome via CDP on port 9222
2. Navigates to X.com home page
3. Opens the compose dialog
4. Types the tweet text character-by-character
5. Waits for validation
6. Presses `Cmd+Enter` to post
7. Confirms successful posting

## Technical Details

- Uses Playwright Core for CDP automation
- Types text slowly (5ms delay) to trigger React events
- Uses keyboard shortcut instead of button clicks (more reliable)
- Handles X.com's contenteditable div properly
- Auto-dismisses any dialogs that might block the process

## Character Limit

Twitter/X.com enforces a **280 character limit** for standard tweets. The script will:
- Show character count before posting
- Warn if over limit (but won't prevent posting)

To check character count:
```bash
echo -n "Your tweet text" | wc -c
```

## Troubleshooting

**"No browser contexts found" error:**
- Make sure Chrome is running with `--remote-debugging-port=9222`
- Check that Chrome wasn't started with other debugging flags

**"Could not open compose dialog" error:**
- Ensure you're logged in to X.com
- Refresh the X.com page
- Close any existing compose dialogs

**Tweet doesn't post:**
- Check Chrome console for JavaScript errors
- Verify X.com account isn't rate-limited
- Try posting manually first to ensure account is working

**Button stays disabled:**
- Script uses keyboard shortcut, so disabled button is bypassed
- If still failing, check X.com account status

## Rate Limits

X.com has posting rate limits:
- Free accounts: Variable, typically 50-100 tweets/day
- Verified accounts: Higher limits

If you hit rate limits, wait before posting again.

## Notes

- The script uses the official X.com keyboard shortcut (`Cmd+Enter`)
- Text is typed character-by-character to properly trigger validation
- Remote debugging port 9222 is the Playwright standard
- Works with existing Chrome sessions (preserves login state)
- Does not require Twitter API keys or OAuth
