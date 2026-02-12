---
name: notion-sync
description: Upload and sync markdown files to Notion using the official Notion MCP server. Use when users want to upload markdown documents to Notion, sync local markdown to Notion pages, or convert markdown content to Notion format. Supports automatic title generation from file content when requested.
---

# Notion Sync

Upload markdown files to Notion using the official Notion MCP server with full formatting support.

## When to Use

Use this skill when the user wants to:
- Upload a markdown file to Notion
- Sync local documentation to Notion pages
- Convert markdown to Notion format
- Create Notion pages from markdown content
- Rename/retitle pages based on content analysis

## Prerequisites

The Notion MCP server must be configured in Claude Code with proper authentication.

## Setup Instructions

### First-Time Setup

1. **Add Notion MCP Server** (if not already configured):
   ```bash
   claude mcp add --transport http notion https://mcp.notion.com/mcp
   ```

2. **Authenticate with Notion**:
   After adding the server, run `/mcp` in a Claude Code session to complete OAuth authentication.
   You'll be redirected to Notion to authorize access to your workspace.

3. **Verify Connection**:
   Run `/mcp` again to see the available Notion MCP tools.

### Checking Configuration

To check if Notion MCP is already configured, run `/mcp` in the session.
If you see Notion tools listed (like `create-pages`, `search`, etc.), the setup is complete.

## Usage

Simply ask to upload a markdown file to Notion. Examples:

- "Upload document.md to Notion"
- "Sync README.md to Notion"
- "Create a Notion page from analysis.md"
- "Upload report.md to Notion and rename it based on the content"
- "Upload this file to Notion with a better title"

## Workflow

When a user requests to upload markdown to Notion:

1. **Check MCP Configuration**: Verify Notion MCP server is connected (check `/mcp` output)
2. **If not configured**: Guide user through setup steps above
3. **Read the markdown file**: Load the file contents
4. **Determine title**:
   - If user asked to rename based on content: Analyze the file and generate an appropriate title
   - Otherwise: Use the first H1 heading or filename as the title
5. **Upload to Notion**: Use the MCP `create-pages` tool with:
   - `properties`: Set the title
   - `content`: Pass the full markdown content (Notion-flavored Markdown)
   - `parent` (optional): Specify a parent page ID if provided by the user
6. **Return URL**: Provide the user with the created Notion page URL

## Supported Markdown Features

Notion-flavored Markdown supports:
- **Headings**: `#`, `##`, `###` (h1, h2, h3)
- **Bold**: `**text**`
- **Italic**: `*text*`
- **Strikethrough**: `~~text~~`
- **Inline code**: `` `code` ``
- **Code blocks**: ` ```language ` with syntax highlighting
- **Links**: `[text](url)`
- **Lists**: Bulleted (`-`, `*`) and numbered (`1.`)
- **Tables**: Markdown tables with headers
- **Block quotes**: `> quote`
- **Dividers**: `---`

## MCP Tools Used

This skill primarily uses the **`create-pages`** tool from Notion MCP:

**Parameters:**
- `properties` (required): JSON object with at least a "title" property
  ```json
  {"title": "Page Title"}
  ```
- `content` (required): String containing Notion-flavored Markdown
- `parent` (optional): Parent page/database ID where the page should be created
  - If omitted, creates a private page at workspace level

**Example tool call:**
```json
{
  "properties": {"title": "My Document"},
  "content": "# My Document\n\nThis is the content...",
  "parent": "page_id_here"
}
```

## Finding Page IDs

**From URL:**
- Page URL: `https://notion.so/Page-Title-abc123def456...`
- Page ID: `abc123def456...` (the part after the title)

**Via MCP search tool:**
Users can search for pages using the Notion MCP `search` tool if needed.

## Automatic Title Generation

When the user requests to rename or generate a title based on content:

1. **Read the file**: Load the markdown content
2. **Analyze content**: Examine the file to understand its purpose and main topic
3. **Generate title**: Create a concise, descriptive title (under 70 characters)
4. **Upload with new title**: Use the generated title instead of the original filename

## Notes

- Rate limit: 180 requests per minute (3 requests per second) across all MCP tool calls
- Notion MCP uses the API version `2025-09-03`
- The MCP server is optimized for AI workflows with efficient Markdown-based content
- Up to 100 blocks can be created per request
- All formatting is preserved through Notion-flavored Markdown

## Common Issues

**"Notion MCP not configured" error:**
- Run `claude mcp add --transport http notion https://mcp.notion.com/mcp`
- Then run `/mcp` to authenticate

**"Authentication required" error:**
- Run `/mcp` to complete OAuth flow
- Follow the browser redirect to authorize access

**"No parent page found" error:**
- Either provide a specific parent page ID
- Or omit the parent to create a private page at workspace level

## Benefits of MCP Approach

- No custom Node.js script to maintain
- Direct OAuth authentication (no manual API key management)
- Leverages Claude Code's built-in MCP support
- More efficient token usage with Markdown format
- Access to all Notion MCP tools (search, update, etc.)
