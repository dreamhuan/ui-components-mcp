// app/comp-mcp-server/tools/ui.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import * as path from 'path';
import { UI_SRC_PATH } from '../lib/paths.js';
// We only need safeReadFile for this parsing approach
// (这种解析方法我们只需要 safeReadFile)
import { safeReadFile } from '../lib/safe-fs.js';

/**
 * [UI] Gets the list of UI components from 'packages/ui/src/index.ts'.
 * (从 'packages/ui/src/index.ts' 获取 UI 组件列表。)
 */
async function getUIComponentList(): Promise<string[]> {
  const indexContent = await safeReadFile(UI_SRC_PATH, 'index.ts');

  // Updated Regex:
  // (更新的正则表达式：)
  // 1. 's' flag (dotall): Allows '.' to match newline characters (\n),
  //    handling multiline export blocks.
  //    (s 标志 (dotall)：允许 '.' 匹配换行符 (\n)，以处理多行导出块。)
  // 2. '.*?': Non-greedy match for the path.
  //    (.*?：对路径进行非贪婪匹配。)
  const exportRegex = /export .*? from "\.\/(.*?)";/gs;

  const components: string[] = [];
  // Exclude common non-component paths
  // (排除常见的非组件路径)
  const EXCLUDE_PATHS = new Set(['utils', 'hooks', 'contexts', 'types', 'styles']);
  let match;

  while ((match = exportRegex.exec(indexContent)) !== null) {
    const modulePath = match[1];
    if (modulePath && !EXCLUDE_PATHS.has(modulePath)) {
      components.push(modulePath);
    }
  }
  return [...new Set(components)]; // Use Set to remove duplicates
}

// Function to register all UI-related tools
// (注册所有 UI 相关工具的函数)
export function registerUiTools(server: McpServer) {
  // [Tool 1: UI Components]
  server.registerTool(
    'listUIComponents',
    {
      title: '[UI] 列出所有UI组件',
      description:
        '获取 @vibeus/ui 组件库中所有可用组件的基础名称列表 (例如: "button", "dialog")。',
      inputSchema: {},
      outputSchema: {
        components: z.array(z.string()),
      },
    },
    async () => {
      const components = await getUIComponentList();
      return {
        content: [{ type: 'text', text: `找到了 ${components.length} 个 UI 组件。` }],
        structuredContent: { components },
      };
    }
  );

  // [Tool 2: UI Components]
  // This logic assumes "button" (from the list) maps to "button.tsx"
  // (此逻辑假设列表中的 "button" 映射到 "button.tsx")
  server.registerTool(
    'getUIComponentSource',
    {
      title: '[UI] 获取组件源代码',
      description: '根据组件的基础文件名 (模块路径) 获取其 .tsx 源代码。',
      inputSchema: {
        componentName: z.string().describe('组件的模块路径 (例如: "button")'),
      },
      outputSchema: {
        name: z.string().describe('组件的文件名 (e.g., "button.tsx")'),
        content: z.string().describe('文件的源代码'),
      },
    },
    async ({ componentName }) => {
      const safeName = path.basename(componentName); // Security
      const fileName = `${safeName}.tsx`;
      const content = await safeReadFile(UI_SRC_PATH, fileName);
      return {
        content: [{ type: 'text', text: `成功获取 ${fileName} 的源代码。` }],
        structuredContent: { name: fileName, content },
      };
    }
  );
}
