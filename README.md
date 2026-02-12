# Vibe Skills

🎯 A collection of Claude Code skills for productivity, automation, and creativity.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude-Code-blueviolet)](https://code.claude.com)

## Overview

This repository contains reusable skills for [Claude Code](https://code.claude.com), designed to extend Claude's capabilities with specialized workflows and automations.

## Skills Collection

### 🐦 [Twitter Post](./twitter-post-skill)

Automate Twitter/X.com posting using Chrome DevTools Protocol.

**Features:**
- ✅ No API keys required
- ✅ Uses keyboard shortcuts for reliable posting
- ✅ Character validation (280 limit)
- ✅ Session preservation

**Quick start:**
```bash
cd twitter-post-skill
npm install
node scripts/post-tweet.js "Your tweet here!"
```

[→ Full Documentation](./twitter-post-skill/README.md)

### 📝 [Notion Sync](./notion-sync-skill)

Upload and sync markdown files to Notion using the official Notion MCP server.

**Features:**
- ✅ MCP-based (no custom scripts needed)
- ✅ OAuth authentication (no manual API keys)
- ✅ Rich text formatting (bold, italic, code, strikethrough)
- ✅ Markdown tables → Notion tables
- ✅ Code blocks with syntax highlighting
- ✅ Smart title generation from content
- ✅ Built-in Claude Code integration

**Quick start:**
```bash
# One-time setup
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Then just ask Claude:
# "Upload document.md to Notion with a better title"
```

[→ Full Documentation](./notion-sync-skill/README.md)

---

## Installation

### Install All Skills

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/vibe-skills.git
cd vibe-skills
```

### Install to Claude Code

#### Option 1: Symlink (Recommended for Development)

Create a `.claude/skills/` directory and symlink the skills:

```bash
# From the vibe-skills directory
mkdir -p .claude/skills

# Symlink individual skills
ln -s ../../notion-sync-skill .claude/skills/notion-sync
ln -s ../../twitter-post-skill .claude/skills/twitter-post

# Skills are now installed and will reflect any changes automatically
```

#### Option 2: Copy (For Production Use)

Copy skills to your Claude Code skills directory:

```bash
# Install all skills
cp -r vibe-skills/* ~/.claude/skills/

# Or install individual skill
cp -r vibe-skills/twitter-post-skill ~/.claude/skills/twitter-post
cp -r vibe-skills/notion-sync-skill ~/.claude/skills/notion-sync
```

### MCP Server Setup (for Notion Sync)

The Notion Sync skill requires the Notion MCP server:

```bash
# Add Notion MCP server
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Authenticate (run this in a Claude Code session)
/mcp
```

## Usage with Claude Code

Once installed, simply ask Claude to use the skills:

```
Post this tweet: "Just launched my new project!"
```

Claude will automatically detect and use the appropriate skill.

## Skills Directory Structure

```
vibe-skills/
├── twitter-post-skill/      # Twitter automation
│   ├── SKILL.md            # Claude Code skill definition
│   ├── README.md           # Documentation
│   ├── scripts/            # Automation scripts
│   └── package.json        # Dependencies
│
└── [future-skills]/        # More skills coming soon!
```

## Contributing

Contributions are welcome! To add a new skill:

1. Fork this repository
2. Create a new directory for your skill: `your-skill-name/`
3. Include:
   - `SKILL.md` - Claude Code skill definition
   - `README.md` - Skill documentation
   - `scripts/` or `src/` - Implementation
   - `package.json` - Dependencies (if needed)
4. Update this main README
5. Submit a Pull Request

### Skill Guidelines

- Follow the existing structure
- Include comprehensive documentation
- Add tests where applicable
- Use MIT or compatible license
- Keep dependencies minimal

## Roadmap

Planned skills:

- 📧 Email automation
- 📝 Document generation
- 🔍 Web scraping
- 📊 Data analysis
- 🎨 Image processing
- 🤖 Workflow automation

Have an idea? [Open an issue](https://github.com/YOUR_USERNAME/vibe-skills/issues)!

## Requirements

- Node.js ≥14
- Claude Code (for skill integration)
- Additional requirements vary by skill (see individual READMEs)

## License

MIT License - see [LICENSE](LICENSE) file for details.

Individual skills may have additional license terms - check each skill's directory.

## Community

- 📖 [Documentation](./docs)
- 🐛 [Issue Tracker](https://github.com/YOUR_USERNAME/vibe-skills/issues)
- 💬 [Discussions](https://github.com/YOUR_USERNAME/vibe-skills/discussions)
- 🌟 [Claude Code Community](https://code.claude.com)

## Acknowledgments

- Built for [Claude Code](https://code.claude.com)
- Inspired by the automation and productivity community
- Thanks to all contributors!

## Support

If you find these skills helpful:
- ⭐ Star this repository
- 🐛 Report bugs
- 💡 Suggest new skills
- 🤝 Contribute code

---

**Created with ❤️ for the Claude Code community**
