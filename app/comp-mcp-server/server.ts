// app/comp-mcp-server/server.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// 导入所有 AI 工具 (Tools)
import { registerUiTools } from './tools/ui.js';
import { registerDocumentationTools } from './tools/documentation.js';
import { registerContextTools } from './tools/context.js';
import { registerDemoTools } from './tools/demo.js';
import { registerRadixTools } from './tools/radix.js';

// 1. 创建 MCP 服务器实例
export const server = new McpServer({
  name: 'vibeus-design-system-mcp',
  version: '1.0.0', // 更新版本以重新添加资源
});

// 2. 注册所有模块
registerUiTools(server);
registerDocumentationTools(server);
registerContextTools(server);
registerDemoTools(server);
registerRadixTools(server);

// 3. 导出已完全配置的服务器
export default server;
