// app/comp-mcp-server/tools/context.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
import { DESIGN_SYSTEM_PATH, PACKAGES_PATH } from '../lib/paths.js';
import { safeReadFile } from '../lib/safe-fs.js';

// 注册所有与上下文相关的工具
export function registerContextTools(server: McpServer) {
  // [Tool 9: Context]
  server.registerTool(
    'getPackageJson',
    {
      title: '[Context] Get package.json',
      description: 'Get the content of package.json from a package or the monorepo root.',
      inputSchema: {
        packageName: z
          .string()
          .describe(
            'The package name (e.g., "ui", "icons"), or use "root" for the root package.json.'
          ),
      },
      outputSchema: {
        path: z.string().describe('The relative path to package.json'),
        data: z.any().describe('The parsed JSON data'),
      },
    },
    async ({ packageName }) => {
      console.log('MCP tool calls getPackageJson', packageName);
      const safeName = path.basename(packageName);
      let relativePath: string;
      let readBasePath: string;

      if (safeName === 'root') {
        relativePath = 'package.json';
        readBasePath = DESIGN_SYSTEM_PATH;
      } else {
        relativePath = path.join(safeName, 'package.json');
        readBasePath = PACKAGES_PATH;
      }

      const fileContent = await safeReadFile(readBasePath, relativePath);
      const jsonData = JSON.parse(fileContent);

      const resultData = {
        path: relativePath,
        data: jsonData,
      };
      return {
        content: [
          { type: 'text', text: `Successfully parsed content of ${relativePath}.` },
          { type: 'text', text: JSON.stringify(resultData, null, 2) },
        ],
        structuredContent: resultData,
      };
    }
  );
}
