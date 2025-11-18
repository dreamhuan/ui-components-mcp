// app/comp-mcp-server/tools/documentation.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
import { DOCS_CONTENT_PATH } from '../lib/paths.js';
import { safeReadFile } from '../lib/safe-fs.js';

// 注册所有与文档相关的工具
export function registerDocumentationTools(server: McpServer) {
  // [Tool 8: Documentation]
  server.registerTool(
    'getComponentDocumentation',
    {
      title: '[Docs] Get Component Documentation and API (MDX)',
      description:
        'Get the .mdx source file for a component. This file contains usage examples and manually maintained Props API tables.',
      inputSchema: {
        componentName: z
          .string()
          .describe('The base file name of the component (e.g., "button", "tourtip")'),
      },
      outputSchema: {
        name: z.string().describe('The documentation file name (e.g., "tourtip.mdx")'),
        content: z.string().describe('The raw content of the MDX file'),
      },
    },
    async ({ componentName }) => {
      const safeName = path.basename(componentName);
      const fileName = `${safeName}.mdx`;
      const content = await safeReadFile(DOCS_CONTENT_PATH, fileName);

      const resultData = { name: fileName, content };
      return {
        content: [
          { type: 'text', text: `Successfully retrieved documentation content for ${fileName}.` },
          { type: 'text', text: JSON.stringify(resultData, null, 2) },
        ],
        structuredContent: resultData,
      };
    }
  );
}
