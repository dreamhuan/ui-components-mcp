// app/comp-mcp-server/tools/icons.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
import { ICON_ASSETS_PATH } from '../lib/paths.js';
import { safeReadFile, safeReadDir } from '../lib/safe-fs.js';

/**
 * [Icons] Gets the list of icon categories from 'packages/icons/src/assets'.
 * (从 'packages/icons/src/assets' 获取图标分类列表。)
 */
async function getIconCategoryList(): Promise<string[]> {
  const entries = await safeReadDir(ICON_ASSETS_PATH);
  return entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
}

/**
 * [Icons] Gets the list of icons within a specific category.
 * (获取特定分类下的图标列表。)
 */
async function getIconsByCategory(category: string): Promise<string[]> {
  // path.basename ensures no traversal (e.g., "action" not "../action")
  const safeCategory = path.basename(category);
  const entries = await safeReadDir(ICON_ASSETS_PATH, safeCategory);
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.svg'))
    .map(entry => entry.name);
}

// Function to register all Icon-related tools
export function registerIconTools(server: McpServer) {
  // [Tool 3: Icons]
  server.registerTool(
    'listIconCategories',
    {
      title: '[Icons] 列出所有图标分类',
      description:
        '获取 `packages/icons/src/assets` 目录下的所有图标分类 (例如: "action", "av", "file")。',
      inputSchema: {},
      outputSchema: {
        categories: z.array(z.string()),
      },
    },
    async () => {
      const categories = await getIconCategoryList();
      return {
        content: [{ type: 'text', text: `找到了 ${categories.length} 个图标分类。` }],
        structuredContent: { categories },
      };
    }
  );

  // [Tool 4: Icons]
  server.registerTool(
    'listIconsByCategory',
    {
      title: '[Icons] 列出分类下的所有图标',
      description: '获取指定分类下的所有 .svg 图标文件名。',
      inputSchema: {
        category: z.string().describe('图标分类名 (例如: "action")'),
      },
      outputSchema: {
        category: z.string(),
        icons: z.array(z.string()).describe('SVG 文件名列表 (例如: "copy.svg")'),
      },
    },
    async ({ category }) => {
      const icons = await getIconsByCategory(category);
      return {
        content: [{ type: 'text', text: `分类 "${category}" 下有 ${icons.length} 个图标。` }],
        structuredContent: { category, icons },
      };
    }
  );

  // [Tool 5: Icons]
  server.registerTool(
    'getIconSource',
    {
      title: '[Icons] 获取图标SVG源码',
      description: '获取指定图标的 .svg 源代码字符串。',
      inputSchema: {
        category: z.string().describe('图标分类名 (例如: "action")'),
        iconName: z.string().describe('图标文件名 (例如: "copy.svg")'),
      },
      outputSchema: {
        name: z.string().describe('图标的完整路径'),
        content: z.string().describe('SVG 源代码'),
      },
    },
    async ({ category, iconName }) => {
      const safeCategory = path.basename(category);
      const safeIconName = path.basename(iconName);
      const relativePath = path.join(safeCategory, safeIconName);

      const content = await safeReadFile(ICON_ASSETS_PATH, relativePath);
      return {
        content: [{ type: 'text', text: `成功获取 ${relativePath} 的 SVG 源码。` }],
        structuredContent: { name: relativePath, content },
      };
    }
  );
}