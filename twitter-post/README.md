# Twitter Post Skill for Claude Code

🐦 Automate Twitter/X.com posting using Chrome DevTools Protocol (CDP) - A Claude Code skill for seamless social media automation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14-brightgreen)](https://nodejs.org/)

## Overview

A reusable [Claude Code](https://code.claude.com) skill that enables automated posting to X.com (Twitter) using Chrome's DevTools Protocol. No API keys or OAuth required - works directly with your logged-in browser session.

## Features

- ✅ **No API Keys Required**: Uses Chrome CDP instead of Twitter API
- ✅ **Session Preservation**: Works with your existing Chrome login
- ✅ **Reliable Posting**: Uses native keyboard shortcuts (`Cmd+Enter`)
- ✅ **Character Validation**: Checks 280-character limit before posting
- ✅ **Error Handling**: Graceful recovery from common automation issues
- ✅ **Simple Interface**: Just pass tweet text as an argument

## Quick Start

### Prerequisites

- Node.js ≥14
- Chrome/Chromium browser
- Claude Code (optional, for skill integration)

### Installation

1. **Clone this repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/twitter-post-skill.git
   cd twitter-post-skill
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Chrome with remote debugging**:
   ```bash
   # macOS
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

   # Windows
   chrome.exe --remote-debugging-port=9222

   # Linux
   google-chrome --remote-debugging-port=9222
   ```

4. **Log in to X.com** in Chrome

### Usage

#### Standalone Usage

```bash
node scripts/post-tweet.js "Your tweet text here!"
```

#### With Claude Code

1. Copy this skill to your Claude Code skills directory:
   ```bash
   cp -r twitter-post-skill ~/.claude/skills/twitter-post
   ```

2. Ask Claude to post tweets:
   ```
   Post this tweet: "Just launched my new project! 🚀"
   ```

## Examples

```bash
# Simple tweet
node scripts/post-tweet.js "Hello, world!"

# Tweet with link
node scripts/post-tweet.js "Check out my latest blog post: https://example.com"

# Multi-line tweet
node scripts/post-tweet.js "Line 1

Line 2

Line 3"

# Tweet with emoji
node scripts/post-tweet.js "Great news! 🎉 Project launched 🚀"
```

## How It Works

1. Connects to Chrome via CDP on port 9222
2. Navigates to X.com home page
3. Opens the compose dialog
4. Types tweet character-by-character (triggers React validation)
5. Posts using keyboard shortcut (`Cmd+Enter` or `Ctrl+Enter`)
6. Confirms successful posting

## Configuration

### Custom Chrome Port

Edit `scripts/post-tweet.js`:
```javascript
const browser = await playwright.chromium.connectOverCDP('http://localhost:YOUR_PORT');
```

### Typing Speed

Adjust the delay between characters:
```javascript
await page.keyboard.type(char);
await page.waitForTimeout(5); // Change this value (milliseconds)
```

## Troubleshooting

### Chrome Connection Issues

**Error: "No browser contexts found"**
- Ensure Chrome is running with `--remote-debugging-port=9222`
- Check no other process is using port 9222
- Restart Chrome with the debugging flag

**Verify CDP is working**:
```bash
curl http://localhost:9222/json/version
```

### X.com Issues

**Error: "Could not open compose dialog"**
- Verify you're logged in to X.com
- Refresh the X.com page
- Close any existing compose dialogs manually

**Tweet doesn't appear**
- Check X.com for rate limits
- Verify account isn't suspended
- Try posting manually to test account status

## Character Limits

- Standard tweets: **280 characters**
- The script warns if over limit but doesn't block
- X.com will reject tweets that are too long

Check character count:
```bash
echo -n "Your tweet" | wc -c
```

## Security Considerations

⚠️ **Important**: Chrome with remote debugging enabled has full browser control access. Use responsibly:

- Only run on trusted networks
- Don't leave remote debugging enabled permanently
- Chrome with debugging is not secure for general browsing
- Use a separate Chrome profile for automation if possible

## Limitations

- Text-only tweets (no images/videos)
- Cannot create threads automatically
- Subject to X.com rate limits
- Requires Chrome to be running with remote debugging
- User must be logged in to X.com

## Rate Limits

X.com enforces posting rate limits:
- Free accounts: ~50-100 tweets/day (varies)
- Verified accounts: Higher limits

If you hit rate limits, wait before posting again.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- Built for [Claude Code](https://code.claude.com)
- Uses [Playwright](https://playwright.dev/) for CDP automation
- Inspired by the need for simple, API-free Twitter automation

## Related Projects

- [Claude Code](https://code.claude.com) - AI-powered coding assistant
- [Playwright](https://playwright.dev/) - Browser automation library

## Support

- 📖 [Documentation](./SKILL.md)
- 🐛 [Issue Tracker](https://github.com/YOUR_USERNAME/twitter-post-skill/issues)
- 💬 [Discussions](https://github.com/YOUR_USERNAME/twitter-post-skill/discussions)

## Author

Created with ❤️ for the Claude Code community

---

**⭐ Star this repo if you find it helpful!**
