// app/comp-mcp-server/tools/demo.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
import { DEMO_PATH } from '../lib/paths.js';
import { safeReadFile } from '../lib/safe-fs.js';

// 注册所有与 Demo 相关的工具
export function registerDemoTools(server: McpServer) {
  // [Tool 11: Demo]
  server.registerTool(
    'getComponentDemoSource',
    {
      title: '[Demo] Get Component Demo Source Code',
      description:
        'Get the .tsx example code from the `apps/docs/demo/` directory (referenced by <DemoRenderer> in mdx).',
      inputSchema: {
        demoName: z
          .string()
          .describe('The name of the demo (e.g., "accordion-demo", "button-demo")'),
      },
      outputSchema: {
        name: z.string().describe('The demo file name (e.g., "accordion-demo.tsx")'),
        content: z.string().describe('The source code of the .tsx demo file'),
      },
    },
    async ({ demoName }) => {
      console.log('MCP tool calls getComponentDemoSource', demoName);
      const safeName = path.basename(demoName);
      const fileName = `${safeName}.tsx`;
      const content = await safeReadFile(DEMO_PATH, fileName);

      const resultData = { name: fileName, content };
      return {
        content: [
          { type: 'text', text: `Successfully retrieved demo example: ${fileName}` },
          { type: 'text', text: JSON.stringify(resultData, null, 2) },
        ],
        structuredContent: resultData,
      };
    }
  );
}
