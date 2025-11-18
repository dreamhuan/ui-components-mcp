// app/comp-mcp-server/tools/tokens.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TOKEN_DATA_PATH } from '../lib/paths.js';
import { safeReadFile } from '../lib/safe-fs.js';

/**
 * [Tokens] 递归查找 'packages/token/src/assets/data' 中所有的 token JSON 文件。
 * @param dir 要扫描的目录。
 * @param relativeRoot 相对于 token data 根目录的路径。
 */
async function getTokenFiles(dir: string, relativeRoot: string = ''): Promise<string[]> {
  let files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryRelativePath = path.join(relativeRoot, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await getTokenFiles(path.join(dir, entry.name), entryRelativePath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(entryRelativePath.replace(/\\/g, '/')); // 规范化路径分隔符
    }
  }
  return files;
}

// 注册所有与 Token 相关的工具
export function registerTokenTools(server: McpServer) {
  // [Tool 6: Tokens]
  server.registerTool(
    'listDesignTokenFiles',
    {
      title: '[Tokens] List All Design Token JSON Files',
      description:
        'Recursively list all available .json token files in the `packages/token/src/assets/data` directory.',
      inputSchema: {},
      outputSchema: {
        files: z
          .array(z.string())
          .describe(
            'Token file paths relative to the data directory (e.g., "color/primitive.json", "gap/web.json")'
          ),
      },
    },
    async () => {
      const files = await getTokenFiles(TOKEN_DATA_PATH);
      return {
        content: [{ type: 'text', text: `Found ${files.length} token definition files.` }],
        structuredContent: { files },
      };
    }
  );

  // [Tool 7: Tokens]
  server.registerTool(
    'getDesignTokenData',
    {
      title: '[Tokens] Get Design Token Data',
      description: 'Read and parse the content of a design token .json file.',
      inputSchema: {
        filePath: z
          .string()
          .describe(
            'The path to the token file (from `listDesignTokenFiles` output, e.g., "color/primitive.json")'
          ),
      },
      outputSchema: {
        filePath: z.string(),
        // 数据可以是任何有效的 JSON 对象，因此 z.any() 是合适的
        data: z.any().describe('The parsed JSON token data'),
      },
    },
    async ({ filePath }) => {
      // safeReadFile 将处理安全验证
      const fileContent = await safeReadFile(TOKEN_DATA_PATH, filePath);
      const jsonData = JSON.parse(fileContent);
      return {
        content: [{ type: 'text', text: `Successfully parsed token file: ${filePath}` }],
        structuredContent: {
          filePath: filePath,
          data: jsonData,
        },
      };
    }
  );
}
