// app/comp-mcp-server/tools/icons.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
import { ICON_ASSETS_PATH } from '../lib/paths.js';
import { safeReadFile, safeReadDir } from '../lib/safe-fs.js';

/**
 * [Icons] 从 'packages/icons/src/assets' 获取图标分类列表。
 */
async function getIconCategoryList(): Promise<string[]> {
  const entries = await safeReadDir(ICON_ASSETS_PATH);
  return entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
}

/**
 * [Icons] 获取特定分类下的图标列表。
 */
async function getIconsByCategory(category: string): Promise<string[]> {
  // path.basename 确保没有路径遍历 (例如, "action" 而不是 "../action")
  const safeCategory = path.basename(category);
  const entries = await safeReadDir(ICON_ASSETS_PATH, safeCategory);
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.svg'))
    .map(entry => entry.name);
}

// 注册所有与 Icon 相关的工具
export function registerIconTools(server: McpServer) {
  // [Tool 3: Icons]
  server.registerTool(
    'listIconCategories',
    {
      title: '[Icons] List All Icon Categories',
      description:
        'Get all icon categories from the `packages/icons/src/assets` directory (e.g., "action", "av", "file").',
      inputSchema: {},
      outputSchema: {
        categories: z.array(z.string()),
      },
    },
    async () => {
      const categories = await getIconCategoryList();
      return {
        content: [{ type: 'text', text: `Found ${categories.length} icon categories.` }],
        structuredContent: { categories },
      };
    }
  );

  // [Tool 4: Icons]
  server.registerTool(
    'listIconsByCategory',
    {
      title: '[Icons] List All Icons in a Category',
      description: 'Get all .svg icon file names within a specific category.',
      inputSchema: {
        category: z.string().describe('The icon category name (e.g., "action")'),
      },
      outputSchema: {
        category: z.string(),
        icons: z.array(z.string()).describe('List of SVG file names (e.g., "copy.svg")'),
      },
    },
    async ({ category }) => {
      const icons = await getIconsByCategory(category);
      return {
        content: [{ type: 'text', text: `Found ${icons.length} icons in category "${category}".` }],
        structuredContent: { category, icons },
      };
    }
  );

  // [Tool 5: Icons]
  server.registerTool(
    'getIconSource',
    {
      title: '[Icons] Get Icon SVG Source',
      description: 'Get the .svg source code string for a specific icon.',
      inputSchema: {
        category: z.string().describe('The icon category name (e.g., "action")'),
        iconName: z.string().describe('The icon file name (e.g., "copy.svg")'),
      },
      outputSchema: {
        name: z.string().describe('The full path of the icon'),
        content: z.string().describe('The SVG source code'),
      },
    },
    async ({ category, iconName }) => {
      const safeCategory = path.basename(category);
      const safeIconName = path.basename(iconName);
      const relativePath = path.join(safeCategory, safeIconName);

      const content = await safeReadFile(ICON_ASSETS_PATH, relativePath);
      return {
        content: [{ type: 'text', text: `Successfully retrieved SVG source for ${relativePath}.` }],
        structuredContent: { name: relativePath, content },
      };
    }
  );
}
