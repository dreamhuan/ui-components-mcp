// app/comp-mcp-server/tools/icon-exports.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
import { pascalCase } from 'change-case';
// Import the validation tools
import { safeStat } from '../lib/safe-fs.js';
import { ICON_ASSETS_PATH } from '../lib/paths.js';

// Function to register the icon export tool
export function registerIconExportTools(server: McpServer) {
  // [Tool 10: Icons] (Friendly error handling)
  server.registerTool(
    'getIconExportInfo',
    {
      title: '[Icons] 获取图标导入信息',
      description: '校验图标是否存在后，根据 build.ts 逻辑推断其 React 组件导出名称和导入路径。',
      inputSchema: {
        iconPath: z.string().describe('图标在 assets 目录下的相对路径 (例如: "action/copy.svg")'),
      },

      // --- THIS IS THE KEY CHANGE (这是关键更改) ---
      // We make success fields nullable and add an error field.
      // (我们将成功字段设为可空，并添加一个错误字段。)
      outputSchema: {
        path: z.string(),
        category: z.string().nullable().describe('图标的分类 (例如: "action")'),
        componentName: z.string().nullable().describe('React 组件的导出名称 (例如: "CopyIcon")'),
        importStatement: z.string().nullable().describe('完整的 import 语句'),
        error: z.string().nullable().describe('如果图标不存在，则返回错误信息'),
      },
    },
    async ({ iconPath }) => {
      // --- NEW VALIDATION (新增校验) ---
      try {
        // We *try* to get the stats.
        // (我们 *尝试* 获取状态。)
        await safeStat(ICON_ASSETS_PATH, iconPath);
      } catch (error: any) {
        // If safeStat throws (e.g., "File not found"), we catch it.
        // (如果 safeStat 抛出错误 (例如 "File not found")，我们捕获它。)
        const friendlyError = `[Icon Validation Failed] The file "${iconPath}" does not exist in ICON_ASSETS_PATH.`;

        // We return a SUCCESSFUL response containing the error message.
        // (我们返回一个 *包含* 错误信息的 *成功* 响应。)
        return {
          content: [{ type: 'text', text: friendlyError }],
          structuredContent: {
            path: iconPath,
            category: null,
            componentName: null,
            importStatement: null,
            error: friendlyError, // The error is part of the data
          },
        };
      }
      // --- END VALIDATION ---

      // --- Success Path (File Exists) ---
      // (成功路径 (文件存在))

      const category = path.dirname(iconPath);
      const baseName = path.basename(iconPath, '.svg');
      const componentName = `${pascalCase(baseName)}Icon`;

      if (category === '.') {
        const rootImportStatement = `import { ${componentName} } from '@vibeus/icons';`;
        return {
          content: [{ type: 'text', text: `图标 ${iconPath} 对应的组件是 ${componentName}。` }],
          structuredContent: {
            path: iconPath,
            category: category,
            componentName: componentName,
            importStatement: rootImportStatement,
            error: null, // Explicitly no error
          },
        };
      }

      const importStatement = `import { ${componentName} } from '@vibeus/icons/${category}';`;

      return {
        content: [{ type: 'text', text: `图标 ${iconPath} 对应的组件是 ${componentName}。` }],
        structuredContent: {
          path: iconPath,
          category: category,
          componentName: componentName,
          importStatement: importStatement,
          error: null, // Explicitly no error
        },
      };
    }
  );
}
