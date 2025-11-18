// app/comp-mcp-server/tools/radix.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
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
      const safeName = path.basename(componentName);
      const fileName = `${safeName}.mdx`;
      const fileContent = await safeReadFile(RADIX_DOCS_PATH, fileName);

      const resultData = {
        name: fileName,
        content: fileContent,
      };
      return {
        content: [
          { type: 'text', text: `Successfully read Radix MDX: ${fileName}` },
          { type: 'text', text: JSON.stringify(resultData, null, 2) },
        ],
        structuredContent: resultData,
      };
    }
  );
}
