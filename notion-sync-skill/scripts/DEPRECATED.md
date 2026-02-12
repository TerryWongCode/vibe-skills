# DEPRECATED

This directory and its contents are **deprecated** as of the refactoring to use Notion MCP server.

## What Changed

The Notion Sync skill now uses the official **Notion MCP server** instead of custom Node.js scripts.

### Old Approach (Deprecated)
- Custom `upload-to-notion.js` script
- Manual API key management via `~/.config/notion/api_key`
- Direct Notion API calls with custom markdown parsing

### New Approach (Current)
- Official Notion MCP server at https://mcp.notion.com/mcp
- OAuth authentication via Claude Code
- Built-in MCP tool: `create-pages`
- No custom scripts needed

## Migration

If you're using the old version:

1. **Set up Notion MCP**:
   ```bash
   claude mcp add --transport http notion https://mcp.notion.com/mcp
   ```

2. **Authenticate**:
   - Start a Claude Code session
   - Run `/mcp` to complete OAuth flow

3. **Remove old configuration** (optional):
   ```bash
   rm -rf ~/.config/notion/api_key
   ```

## Why This Change?

- **Simpler**: No custom scripts to maintain
- **More secure**: OAuth instead of API key files
- **Better integration**: Native Claude Code MCP support
- **More features**: Access to all Notion MCP tools
- **Efficient**: Optimized for AI workflows

## Archive

The old `upload-to-notion.js` script is kept here for reference only.
Do not use it for new implementations.
