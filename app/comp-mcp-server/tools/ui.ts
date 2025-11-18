// app/comp-mcp-server/tools/ui.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
import { UI_SRC_PATH } from '../lib/paths.js';
import { safeReadFile } from '../lib/safe-fs.js';

/**
 * [UI] 从 'packages/ui/src/index.ts' 获取 UI 组件列表。
 */
async function getUIComponentList(): Promise<string[]> {
  const indexContent = await safeReadFile(UI_SRC_PATH, 'index.ts');

  // 更新的正则表达式：
  // 1. 's' 标志 (dotall)：允许 '.' 匹配换行符 (\n)，以处理多行导出块。
  // 2. '.*?': 对路径进行非贪婪匹配。
  const exportRegex = /export .*? from "\.\/(.*?)";/gs;
  const components: string[] = [];
  // 排除常见的非组件路径
  const EXCLUDE_PATHS = new Set(['utils', 'hooks', 'contexts', 'types', 'styles']);
  let match;

  while ((match = exportRegex.exec(indexContent)) !== null) {
    const modulePath = match[1];
    if (modulePath && !EXCLUDE_PATHS.has(modulePath)) {
      components.push(modulePath);
    }
  }
  return [...new Set(components)];
}

// 注册所有 UI 相关工具的函数
export function registerUiTools(server: McpServer) {
  // [Tool 1: UI Components]
  server.registerTool(
    'listUIComponents',
    {
      title: '[UI] List All UI Components',
      description:
        'Get a list of all available component base names in the @vibeus/ui library (e.g., "button", "dialog").',
      inputSchema: {},
      outputSchema: {
        components: z.array(z.string()),
      },
    },
    async () => {
      const components = await getUIComponentList();
      const resultData = { components };
      return {
        content: [
          { type: 'text', text: `Found ${components.length} UI components.` },
          { type: 'text', text: JSON.stringify(resultData, null, 2) }, // 追加 JSON 内容
        ],
        structuredContent: resultData,
      };
    }
  );

  // [Tool 2: UI Components]
  // 此逻辑假设列表中的 "button" 映射到 "button.tsx"
  server.registerTool(
    'getUIComponentSource',
    {
      title: '[UI] Get Component Source Code',
      description:
        'Get the .tsx source code for a component based on its base file name (module path).',
      inputSchema: {
        componentName: z.string().describe('The module path of the component (e.g., "button")'),
      },
      outputSchema: {
        name: z.string().describe('The file name of the component (e.g., "button.tsx")'),
        content: z.string().describe('The source code of the file'),
      },
    },
    async ({ componentName }) => {
      const safeName = path.basename(componentName);
      const fileName = `${safeName}.tsx`;
      const content = await safeReadFile(UI_SRC_PATH, fileName);

      const resultData = { name: fileName, content };
      return {
        content: [
          { type: 'text', text: `Successfully retrieved source code for ${fileName}.` },
          { type: 'text', text: JSON.stringify(resultData, null, 2) }, // 追加 JSON 内容
        ],
        structuredContent: resultData,
      };
    }
  );
}
