// app/comp-mcp-server/tools/demo.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
import { DEMO_PATH } from '../lib/paths.js';
import { safeReadFile } from '../lib/safe-fs.js';

// Function to register all demo-related tools
export function registerDemoTools(server: McpServer) {
  // [Tool 11: Demo]
  server.registerTool(
    'getComponentDemoSource',
    {
      title: '[Demo] 获取组件 Demo 源代码',
      description:
        '从 `apps/docs/demo/` 目录获取 .tsx 示例代码 (由 mdx 中的 <DemoRenderer> 标签引用)。',
      inputSchema: {
        demoName: z.string().describe('Demo 的名称 (例如: "accordion-demo", "button-demo")'),
      },
      outputSchema: {
        name: z.string().describe('Demo 的文件名 (e.g., "accordion-demo.tsx")'),
        content: z.string().describe('Demo .tsx 文件的源代码'),
      },
    },
    async ({ demoName }) => {
      const safeName = path.basename(demoName); // Security
      const fileName = `${safeName}.tsx`;
      const content = await safeReadFile(DEMO_PATH, fileName);
      return {
        content: [{ type: 'text', text: `成功获取 Demo 示例: ${fileName}` }],
        structuredContent: { name: fileName, content },
      };
    }
  );
}
