// app/comp-mcp-server/tools/radix.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
// Import the new Radix path
import { RADIX_DOCS_PATH } from '../lib/paths.js';
import { safeReadFile } from '../lib/safe-fs.js';

// Function to register all Radix API related tools
export function registerRadixTools(server: McpServer) {
  // [Tool 12: Radix Docs]
  server.registerTool(
    'getRadixComponentMdx',
    {
      title: '[Radix] 获取 Radix 组件的 MDX 文档',
      description:
        '从 `website/data/primitives/docs/components` 目录读取一个 Radix 组件的 .mdx 源文件内容。',
      inputSchema: {
        componentName: z.string().describe('Radix 组件的名称 (例如: "accordion", "alert-dialog")'),
      },
      outputSchema: {
        name: z.string().describe('MDX 文件名 (e.g., "accordion.mdx")'),
        content: z.string().describe('MDX 文件的原始内容'),
      },
    },
    async ({ componentName }) => {
      const safeName = path.basename(componentName); // Security
      const fileName = `${safeName}.mdx`;

      // Use the correct base path for safeReadFile
      // (为 safeReadFile 使用正确的基路径)
      const fileContent = await safeReadFile(RADIX_DOCS_PATH, fileName);

      return {
        content: [{ type: 'text', text: `成功读取 Radix MDX: ${fileName}` }],
        structuredContent: {
          name: fileName,
          content: fileContent, // Return the raw MDX content
        },
      };
    }
  );
}
