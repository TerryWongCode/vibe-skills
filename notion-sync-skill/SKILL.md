---
name: notion-sync
description: Upload and sync markdown files to Notion with proper formatting. Use when users want to upload markdown documents to Notion, sync local markdown to Notion pages, or convert markdown content to Notion format with rich text formatting (bold, italic, code), tables, headings, and code blocks.
---

# Notion Sync

Upload markdown files to Notion with full formatting support including bold text, tables, code blocks, and more.

## When to Use

Use this skill when the user wants to:
- Upload a markdown file to Notion
- Sync local documentation to Notion pages
- Convert markdown to Notion format
- Create Notion pages from markdown content

## Prerequisites

1. **Notion API Key**: User must have a Notion integration API key
2. **Parent Page Access**: The integration must be connected to at least one page in the workspace

## Setup Instructions

If the API key is not configured, guide the user through setup:

```bash
# Save API key
mkdir -p ~/.config/notion
echo "your_notion_api_key" > ~/.config/notion/api_key
```

**Getting a Notion API Key:**
1. Go to https://notion.so/my-integrations
2. Click "New integration"
3. Copy the API key (starts with `ntn_` or `secret_`)

**Connecting to a Page:**
1. Open a page in your Notion workspace
2. Click "..." menu (top right)
3. Click "Connect to" or "Add connections"
4. Select your integration

## Usage

To upload a markdown file to Notion:

```bash
node .claude/skills/notion-sync/scripts/upload-to-notion.js <markdown-file> [parent-page-id]
```

**Arguments:**
- `<markdown-file>`: Path to the markdown file to upload (required)
- `[parent-page-id]`: Optional parent page ID. If omitted, uses the first accessible page

**Examples:**

```bash
# Auto-detect parent page
node .claude/skills/notion-sync/scripts/upload-to-notion.js document.md

# Specify parent page
node .claude/skills/notion-sync/scripts/upload-to-notion.js document.md abc123-def456-...
```

## Supported Markdown Features

The script converts:
- **Headings**: `#`, `##`, `###` → Heading 1, 2, 3
- **Bold**: `**text**` → Bold formatting
- **Italic**: `*text*` → Italic formatting
- **Inline code**: `` `code` `` → Code formatting
- **Code blocks**: ` ```language ` → Notion code blocks with syntax highlighting
- **Tables**: Markdown tables → Notion table blocks with headers
- **Lists**: Bulleted (`-`, `*`) and numbered (`1.`) lists
- **Dividers**: `---` → Horizontal divider

## Finding Page IDs

**From URL:**
- Page URL: `https://notion.so/Page-Title-abc123def456...`
- Page ID: `abc123def456...` (the part after the title)

**Via API Search:**
The script automatically searches for accessible pages if no parent ID is provided.

## Workflow

When a user requests to upload markdown to Notion:

1. **Check API key**: Verify `~/.config/notion/api_key` exists
2. **If not configured**: Guide user through setup steps above
3. **Run upload script**: Execute with the markdown file path
4. **Return URL**: Provide the user with the Notion page URL

## Notes

- The script uses Notion API version `2025-09-03`
- Rate limit: ~3 requests/second (handled automatically)
- Tables are created as native Notion table blocks
- The first H1 heading becomes the page title
- Long content is automatically chunked (100 blocks per request)
- All formatting is preserved through Notion's rich text API

## Common Issues

**"No pages found" error:**
- User needs to connect their integration to at least one page
- See "Connecting to a Page" in Setup Instructions

**"API Error 401":**
- Invalid API key
- Re-check the key at https://notion.so/my-integrations

**Tables not rendering:**
- Ensure table has proper markdown format with header separator
- Example:
  ```markdown
  | Header 1 | Header 2 |
  |----------|----------|
  | Cell 1   | Cell 2   |
  ```
