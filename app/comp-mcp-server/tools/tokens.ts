// app/comp-mcp-server/tools/tokens.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TOKEN_DATA_PATH } from '../lib/paths.js';
import { safeReadFile } from '../lib/safe-fs.js';

/**
 * [Tokens] Recursively finds all token JSON files in 'packages/token/src/assets/data'.
 * (递归查找 'packages/token/src/assets/data' 中所有的 token JSON 文件。)
 * @param dir The directory to scan.
 * @param relativeRoot The path relative to the token data root.
 */
async function getTokenFiles(dir: string, relativeRoot: string = ''): Promise<string[]> {
  let files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryRelativePath = path.join(relativeRoot, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await getTokenFiles(path.join(dir, entry.name), entryRelativePath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(entryRelativePath.replace(/\\/g, '/')); // Normalize path separators
    }
  }
  return files;
}

// Function to register all Token-related tools
export function registerTokenTools(server: McpServer) {
  // [Tool 6: Tokens]
  server.registerTool(
    'listDesignTokenFiles',
    {
      title: '[Tokens] 列出所有设计令牌JSON文件',
      description: '递归列出 `packages/token/src/assets/data` 目录中所有可用的 .json 令牌文件。',
      inputSchema: {},
      outputSchema: {
        files: z
          .array(z.string())
          .describe(
            '相对于 data 目录的令牌文件路径 (例如: "color/primitive.json", "gap/web.json")'
          ),
      },
    },
    async () => {
      const files = await getTokenFiles(TOKEN_DATA_PATH);
      return {
        content: [{ type: 'text', text: `找到了 ${files.length} 个令牌定义文件。` }],
        structuredContent: { files },
      };
    }
  );

  // [Tool 7: Tokens]
  server.registerTool(
    'getDesignTokenData',
    {
      title: '[Tokens] 获取设计令牌数据',
      description: '读取并解析一个设计令牌 .json 文件的内容。',
      inputSchema: {
        filePath: z
          .string()
          .describe(
            '令牌文件的路径 (来自 `listDesignTokenFiles` 的输出，例如: "color/primitive.json")'
          ),
      },
      outputSchema: {
        filePath: z.string(),
        // The data can be any valid JSON object, so z.any() is appropriate
        // (数据可以是任何有效的 JSON 对象，因此 z.any() 是合适的)
        data: z.any().describe('已解析的 JSON 令牌数据'),
      },
    },
    async ({ filePath }) => {
      // safeReadFile will handle security validation
      const fileContent = await safeReadFile(TOKEN_DATA_PATH, filePath);
      const jsonData = JSON.parse(fileContent);
      return {
        content: [{ type: 'text', text: `成功解析令牌文件: ${filePath}` }],
        structuredContent: {
          filePath: filePath,
          data: jsonData,
        },
      };
    }
  );
}
