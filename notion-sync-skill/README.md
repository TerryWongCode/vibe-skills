# Notion Sync Skill

A Claude Code skill for uploading markdown files to Notion with rich formatting support.

## Features

- **Rich Text Formatting**: Converts `**bold**`, `*italic*`, `` `code` ``, and `~~strikethrough~~` to native Notion formatting
- **Tables**: Converts markdown tables to interactive Notion table blocks
- **Code Blocks**: Preserves syntax highlighting
- **Headings**: Supports H1, H2, H3
- **Lists**: Bullet and numbered lists
- **Auto-detection**: Automatically finds available parent pages

## Installation

The skill is automatically available when you have this directory in `.claude/skills/`.

## Setup

1. **Create Notion Integration**:
   - Go to https://notion.so/my-integrations
   - Click "New integration"
   - Copy the API key

2. **Save API Key**:
   ```bash
   mkdir -p ~/.config/notion
   echo "your_notion_api_key" > ~/.config/notion/api_key
   ```

3. **Connect Integration to a Page**:
   - Open a page in Notion
   - Click "..." menu → "Connect to" → Select your integration

## Usage

Simply ask Claude to upload a markdown file to Notion:

```
Upload this document to Notion
Sync README.md to Notion
Create a Notion page from analysis.md
```

Claude will:
1. Check for API key configuration
2. Run the upload script
3. Provide you with the Notion page URL

## Manual Usage

You can also run the script directly:

```bash
# Auto-detect parent page
node .claude/skills/notion-sync/scripts/upload-to-notion.js document.md

# Specify parent page ID
node .claude/skills/notion-sync/scripts/upload-to-notion.js document.md abc123-def456...
```

## Supported Markdown

- Headings: `#`, `##`, `###`
- Bold: `**text**`
- Italic: `*text*`
- Inline code: `` `code` ``
- Code blocks: ` ```language `
- Tables with headers
- Bullet lists: `-`, `*`
- Numbered lists: `1.`, `2.`
- Horizontal rules: `---`

## Examples

See the main SKILL.md for detailed usage examples and troubleshooting.
