// app/comp-mcp-server/tools/icon-exports.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
import { pascalCase } from 'change-case';
// 导入校验工具
import { safeStat } from '../lib/safe-fs.js';
import { ICON_ASSETS_PATH } from '../lib/paths.js';

// 注册图标导出工具
export function registerIconExportTools(server: McpServer) {
  // [Tool 10: Icons] (友好的错误处理)
  server.registerTool(
    'getIconExportInfo',
    {
      title: '[Icons] Get Icon Import Info',
      description:
        'After verifying the icon exists, infer its React component export name and import path based on build.ts logic.',
      inputSchema: {
        iconPath: z
          .string()
          .describe(
            'The relative path of the icon in the assets directory (e.g., "action/copy.svg")'
          ),
      },
      outputSchema: {
        path: z.string(),
        category: z.string().nullable().describe('The category of the icon (e.g., "action")'),
        componentName: z
          .string()
          .nullable()
          .describe('The React component export name (e.g., "CopyIcon")'),
        importStatement: z.string().nullable().describe('The complete import statement'),
        error: z
          .string()
          .nullable()
          .describe('Returns an error message if the icon does not exist'),
      },
    },
    async ({ iconPath }) => {
      // --- 新增校验 ---
      try {
        // 尝试获取文件状态
        await safeStat(ICON_ASSETS_PATH, iconPath);
      } catch (error: any) {
        // 如果 safeStat 抛出错误 (例如 "File not found")，我们捕获它
        const friendlyError = `[Icon Validation Failed] The file "${iconPath}" does not exist in ICON_ASSETS_PATH.`;

        // 返回一个 *包含* 错误信息的 *成功* 响应
        return {
          content: [{ type: 'text', text: friendlyError }],
          structuredContent: {
            path: iconPath,
            category: null,
            componentName: null,
            importStatement: null,
            error: friendlyError, // 错误信息是数据的一部分
          },
        };
      }
      // --- 校验结束 ---

      // --- 成功路径 (文件存在) ---
      const category = path.dirname(iconPath);
      const baseName = path.basename(iconPath, '.svg');
      const componentName = `${pascalCase(baseName)}Icon`;

      if (category === '.') {
        const rootImportStatement = `import { ${componentName} } from '@vibeus/icons';`;
        return {
          content: [
            { type: 'text', text: `Icon ${iconPath} corresponds to component ${componentName}.` },
          ],
          structuredContent: {
            path: iconPath,
            category: category,
            componentName: componentName,
            importStatement: rootImportStatement,
            error: null, // 明确没有错误
          },
        };
      }

      const importStatement = `import { ${componentName} } from '@vibeus/icons/${category}';`;

      return {
        content: [
          { type: 'text', text: `Icon ${iconPath} corresponds to component ${componentName}.` },
        ],
        structuredContent: {
          path: iconPath,
          category: category,
          componentName: componentName,
          importStatement: importStatement,
          error: null, // 明确没有错误
        },
      };
    }
  );
}
