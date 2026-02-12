#!/usr/bin/env node

/**
 * Create a Notion page and upload markdown content
 * Usage: node upload-to-notion.js <markdown-file> [parent-page-id]
 * If no parent-page-id is provided, will search for available pages
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const NOTION_VERSION = '2025-09-03';
const API_KEY_PATH = path.join(process.env.HOME, '.config/notion/api_key');

function getApiKey() {
  if (!fs.existsSync(API_KEY_PATH)) {
    console.error('Error: Notion API key not found');
    process.exit(1);
  }
  return fs.readFileSync(API_KEY_PATH, 'utf-8').trim();
}

function notionRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.notion.com',
      port: 443,
      path: `/v1${endpoint}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${getApiKey()}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 400) {
            console.error('API Response:', body);
            reject(new Error(`API Error ${res.statusCode}: ${parsed.message || body}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Parse inline markdown formatting to Notion rich text
function parseInlineFormatting(text) {
  const richText = [];

  // Pattern to match bold, italic, code, etc.
  const pattern = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(~~(.+?)~~)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Add plain text before the match
    if (match.index > lastIndex) {
      const plainText = text.substring(lastIndex, match.index);
      if (plainText) {
        richText.push({
          type: 'text',
          text: { content: plainText }
        });
      }
    }

    // Add formatted text
    if (match[1]) {
      // Bold: **text**
      richText.push({
        type: 'text',
        text: { content: match[2] },
        annotations: { bold: true }
      });
    } else if (match[3]) {
      // Italic: *text*
      richText.push({
        type: 'text',
        text: { content: match[4] },
        annotations: { italic: true }
      });
    } else if (match[5]) {
      // Code: `text`
      richText.push({
        type: 'text',
        text: { content: match[6] },
        annotations: { code: true }
      });
    } else if (match[7]) {
      // Strikethrough: ~~text~~
      richText.push({
        type: 'text',
        text: { content: match[8] },
        annotations: { strikethrough: true }
      });
    }

    lastIndex = pattern.lastIndex;
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    const plainText = text.substring(lastIndex);
    if (plainText) {
      richText.push({
        type: 'text',
        text: { content: plainText }
      });
    }
  }

  // If no formatting found, return simple text
  if (richText.length === 0) {
    return [{ type: 'text', text: { content: text } }];
  }

  return richText;
}

// Parse markdown table to Notion table block
function parseTable(lines, startIndex) {
  const tableLines = [];
  let i = startIndex;

  // Collect all table lines
  while (i < lines.length && lines[i].includes('|')) {
    tableLines.push(lines[i]);
    i++;
  }

  if (tableLines.length < 2) return null;

  // Parse header
  const headerCells = tableLines[0].split('|')
    .map(cell => cell.trim())
    .filter(cell => cell.length > 0);

  // Skip separator line (the one with ---)
  const dataRows = tableLines.slice(2);

  // Parse data rows
  const rows = dataRows.map(line => {
    return line.split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0);
  });

  // Create table block
  const tableWidth = headerCells.length;
  const tableChildren = [];

  // Add header row
  const headerRow = {
    object: 'block',
    type: 'table_row',
    table_row: {
      cells: headerCells.map(cell => parseInlineFormatting(cell))
    }
  };
  tableChildren.push(headerRow);

  // Add data rows
  rows.forEach(row => {
    // Ensure row has correct number of cells
    while (row.length < tableWidth) {
      row.push('');
    }
    const tableRow = {
      object: 'block',
      type: 'table_row',
      table_row: {
        cells: row.slice(0, tableWidth).map(cell => parseInlineFormatting(cell))
      }
    };
    tableChildren.push(tableRow);
  });

  return {
    block: {
      object: 'block',
      type: 'table',
      table: {
        table_width: tableWidth,
        has_column_header: true,
        has_row_header: false,
        children: tableChildren
      }
    },
    linesConsumed: tableLines.length
  };
}

function markdownToNotionBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let inCodeBlock = false;
  let codeLines = [];
  let codeLanguage = '';
  let skipFirstHeading = false;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip first H1 (it's used as page title)
    if (!skipFirstHeading && line.startsWith('# ')) {
      skipFirstHeading = true;
      i++;
      continue;
    }

    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim() || 'plain text';
        codeLines = [];
      } else {
        blocks.push({
          object: 'block',
          type: 'code',
          code: {
            rich_text: [{ type: 'text', text: { content: codeLines.join('\n') } }],
            language: codeLanguage
          }
        });
        inCodeBlock = false;
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      i++;
      continue;
    }

    // Detect tables
    if (line.includes('|') && line.trim().startsWith('|')) {
      // Check if next line is separator
      if (i + 1 < lines.length && lines[i + 1].match(/^\|[\s-:|]+\|$/)) {
        const tableResult = parseTable(lines, i);
        if (tableResult) {
          blocks.push(tableResult.block);
          i += tableResult.linesConsumed;
          continue;
        }
      }
    }

    if (line.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: parseInlineFormatting(line.slice(2)) }
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: parseInlineFormatting(line.slice(3)) }
      });
    } else if (line.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: { rich_text: parseInlineFormatting(line.slice(4)) }
      });
    } else if (line.trim() === '---') {
      blocks.push({ object: 'block', type: 'divider', divider: {} });
    } else if (line.match(/^[\s]*[-*]\s+/)) {
      const content = line.replace(/^[\s]*[-*]\s+/, '');
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: parseInlineFormatting(content) }
      });
    } else if (line.match(/^[\s]*\d+\.\s+/)) {
      const content = line.replace(/^[\s]*\d+\.\s+/, '');
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: parseInlineFormatting(content) }
      });
    } else if (line.trim().length > 0) {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: parseInlineFormatting(line) }
      });
    }

    i++;
  }

  return blocks;
}

function chunkBlocks(blocks, chunkSize = 100) {
  const chunks = [];
  for (let i = 0; i < blocks.length; i += chunkSize) {
    chunks.push(blocks.slice(i, i + chunkSize));
  }
  return chunks;
}

async function findOrPromptParent() {
  console.log('Searching for available pages...');
  const searchResult = await notionRequest('POST', '/search', { page_size: 10 });

  if (searchResult.results && searchResult.results.length > 0) {
    console.log(`\nFound ${searchResult.results.length} accessible page(s):`);
    searchResult.results.forEach((page, i) => {
      const title = page.properties?.title?.title?.[0]?.plain_text ||
                    page.title?.[0]?.plain_text ||
                    'Untitled';
      console.log(`  ${i + 1}. ${title} (${page.id})`);
    });
    return searchResult.results[0].id;
  }

  console.error('\nNo pages found! You need to:');
  console.error('1. Open any page in your Notion workspace');
  console.error('2. Click "..." → "Connect to" → Your integration name');
  console.error('3. Then run this script again');
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: node upload-to-notion.js <markdown-file> [parent-page-id]');
    process.exit(1);
  }

  const markdownFile = args[0];
  let parentPageId = args[1];

  if (!fs.existsSync(markdownFile)) {
    console.error(`Error: File not found: ${markdownFile}`);
    process.exit(1);
  }

  console.log(`📖 Reading ${markdownFile}...`);
  const markdown = fs.readFileSync(markdownFile, 'utf-8');

  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : path.basename(markdownFile, '.md');

  if (!parentPageId) {
    parentPageId = await findOrPromptParent();
    console.log(`\n📄 Using parent page: ${parentPageId}`);
  }

  console.log(`\n✨ Creating page: "${title}"...`);

  const page = await notionRequest('POST', '/pages', {
    parent: { page_id: parentPageId.replace(/-/g, '') },
    properties: {
      title: {
        title: [{ type: 'text', text: { content: title } }]
      }
    }
  });

  console.log(`✓ Page created!`);
  console.log(`  URL: ${page.url}`);
  console.log(`  ID: ${page.id}`);

  console.log('\n🔄 Converting markdown to Notion blocks...');
  const blocks = markdownToNotionBlocks(markdown);
  console.log(`  Generated ${blocks.length} blocks`);

  const chunks = chunkBlocks(blocks);
  console.log(`\n📤 Uploading ${chunks.length} chunk(s)...`);

  for (let i = 0; i < chunks.length; i++) {
    process.stdout.write(`  [${i + 1}/${chunks.length}] `);
    await notionRequest('PATCH', `/blocks/${page.id}/children`, {
      children: chunks[i]
    });
    console.log(`✓ ${chunks[i].length} blocks`);

    if (i < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 350));
    }
  }

  console.log('\n🎉 Upload complete!');
  console.log(`\n👉 View your page: ${page.url}`);
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
