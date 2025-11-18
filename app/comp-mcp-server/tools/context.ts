// app/comp-mcp-server/tools/context.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
import { DESIGN_SYSTEM_PATH, PACKAGES_PATH } from '../lib/paths.js';
import { safeReadFile } from '../lib/safe-fs.js';

// Function to register all context-related tools
export function registerContextTools(server: McpServer) {
  // [Tool 9: Context]
  server.registerTool(
    'getPackageJson',
    {
      title: '[Context] 获取 package.json',
      description: '获取 monorepo 中某个包 (package) 或根目录的 package.json 内容。',
      inputSchema: {
        packageName: z
          .string()
          .describe('包名 (例如: "ui", "icons")，或使用 "root" 获取根目录的 package.json。'),
      },
      outputSchema: {
        path: z.string().describe('package.json 的相对路径'),
        data: z.any().describe('已解析的 JSON 数据'),
      },
    },
    async ({ packageName }) => {
      const safeName = path.basename(packageName); // Security
      let relativePath: string;
      let readBasePath: string;

      if (safeName === 'root') {
        relativePath = 'package.json';
        readBasePath = DESIGN_SYSTEM_PATH; // Read from root
      } else {
        relativePath = path.join(safeName, 'package.json');
        readBasePath = PACKAGES_PATH; // Read from packages/
      }

      const fileContent = await safeReadFile(readBasePath, relativePath);
      const jsonData = JSON.parse(fileContent);

      return {
        content: [{ type: 'text', text: `成功解析 ${relativePath} 的内容。` }],
        structuredContent: {
          path: relativePath,
          data: jsonData,
        },
      };
    }
  );
}
