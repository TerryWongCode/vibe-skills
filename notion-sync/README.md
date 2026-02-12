# Notion Sync Skill

A Claude Code skill for uploading markdown files to Notion using the official Notion MCP server.

## Features

- **MCP-based**: Uses the official Notion MCP server (no custom scripts)
- **OAuth Authentication**: Secure authentication flow built into Claude Code
- **Rich Text Formatting**: Supports `**bold**`, `*italic*`, `` `code` ``, `~~strikethrough~~`, and more
- **Tables**: Converts markdown tables to Notion table blocks
- **Code Blocks**: Preserves syntax highlighting
- **Headings**: Supports H1, H2, H3
- **Lists**: Bullet and numbered lists
- **Smart Titles**: Can automatically generate titles based on file content
- **No Manual API Key Management**: OAuth handles authentication

## Installation

The skill is automatically available when you have this directory in your Claude Code skills folder.

## Setup

### Quick Setup

1. **Add Notion MCP Server**:
   ```bash
   claude mcp add --transport http notion https://mcp.notion.com/mcp
   ```

2. **Authenticate**:
   - Start a Claude Code session
   - Run `/mcp` to initiate OAuth flow
   - Follow the browser redirect to authorize Notion access

3. **Verify**:
   Run `/mcp` again to see available Notion tools

That's it! No manual API keys or configuration files needed.

## Usage

Simply ask Claude to upload a markdown file to Notion:

```
Upload document.md to Notion
Sync README.md to Notion
Create a Notion page from analysis.md
Upload report.md to Notion and rename it based on the content
Upload this file to Notion with a better title
```

Claude will:
1. Check MCP configuration
2. Read the markdown file
3. Generate a title (if requested to rename based on content)
4. Upload using Notion MCP `create-pages` tool
5. Provide you with the Notion page URL

## Supported Markdown

Notion-flavored Markdown supports:
- Headings: `#`, `##`, `###`
- Bold: `**text**`
- Italic: `*text*`
- Strikethrough: `~~text~~`
- Inline code: `` `code` ``
- Code blocks: ` ```language `
- Links: `[text](url)`
- Tables with headers
- Bullet lists: `-`, `*`
- Numbered lists: `1.`, `2.`
- Block quotes: `> quote`
- Horizontal rules: `---`

## Advanced Features

### Automatic Title Generation

Ask Claude to rename or generate a title based on content:
```
Upload document.md to Notion and give it a better title
Upload this file with a title that reflects its content
```

Claude will analyze the file and generate an appropriate title.

### Specify Parent Page

Provide a parent page ID to create the page under a specific parent:
```
Upload document.md to Notion under page abc123-def456...
```

Find page IDs in the URL: `https://notion.so/Page-Title-<PAGE_ID>`

## Benefits Over Custom Scripts

- **No script maintenance**: Uses official Notion MCP server
- **Secure OAuth**: No manual API key management
- **Built-in support**: Leverages Claude Code's MCP integration
- **Efficient**: Optimized token usage with Markdown format
- **Full toolset**: Access to all Notion MCP tools (search, update, etc.)

## Examples

See the main SKILL.md for detailed usage examples and troubleshooting.

## Migration from Old Version

If you were using the previous version with the custom Node.js script:
1. Run the setup steps above to configure Notion MCP
2. The old script (`scripts/upload-to-notion.js`) is no longer needed
3. All uploads now use the MCP `create-pages` tool
