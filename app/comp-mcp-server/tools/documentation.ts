// app/comp-mcp-server/tools/documentation.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
import { DOCS_CONTENT_PATH } from '../lib/paths.js';
import { safeReadFile } from '../lib/safe-fs.js';

// Function to register all documentation-related tools
export function registerDocumentationTools(server: McpServer) {
  // [Tool 8: Documentation]
  server.registerTool(
    'getComponentDocumentation',
    {
      title: '[Docs] 获取组件文档和API (MDX)',
      description: '获取组件的 .mdx 文档源文件。该文件包含用法示例和手动维护的 Props API 表格。',
      inputSchema: {
        componentName: z.string().describe('组件的基础文件名 (例如: "button", "tourtip")'),
      },
      outputSchema: {
        name: z.string().describe('文档的文件名 (e.g., "tourtip.mdx")'),
        content: z.string().describe('MDX 文件的原始内容'),
      },
    },
    async ({ componentName }) => {
      const safeName = path.basename(componentName); // Security
      const fileName = `${safeName}.mdx`;
      const content = await safeReadFile(DOCS_CONTENT_PATH, fileName);
      return {
        content: [{ type: 'text', text: `成功获取 ${fileName} 的文档内容。` }],
        structuredContent: { name: fileName, content },
      };
    }
  );
}
