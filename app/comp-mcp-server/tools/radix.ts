// app/comp-mcp-server/tools/radix.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
// 导入新的 Radix 路径
import { RADIX_DOCS_PATH } from '../lib/paths.js';
import { safeReadFile } from '../lib/safe-fs.js';

// 注册所有与 Radix API 相关的工具
export function registerRadixTools(server: McpServer) {
  // [Tool 12: Radix Docs]
  server.registerTool(
    'getRadixComponentMdx',
    {
      title: '[Radix] Get Radix Component MDX Docs',
      description:
        'Read the .mdx source file content for a Radix component from the `website/data/primitives/docs/components` directory.',
      inputSchema: {
        componentName: z
          .string()
          .describe('The name of the Radix component (e.g., "accordion", "alert-dialog")'),
      },
      outputSchema: {
        name: z.string().describe('MDX file name (e.g., "accordion.mdx")'),
        content: z.string().describe('The raw content of the MDX file'),
      },
    },
    async ({ componentName }) => {
      const safeName = path.basename(componentName); // 安全性：防止路径遍历
      const fileName = `${safeName}.mdx`;

      // 为 safeReadFile 使用正确的基路径
      const fileContent = await safeReadFile(RADIX_DOCS_PATH, fileName);

      return {
        content: [{ type: 'text', text: `Successfully read Radix MDX: ${fileName}` }],
        structuredContent: {
          name: fileName,
          content: fileContent, // 返回原始 MDX 内容
        },
      };
    }
  );
}
