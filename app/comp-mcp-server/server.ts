// app/comp-mcp-server/server.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Import all TOOLS (导入所有 AI 工具)
import { registerUiTools } from './tools/ui.js';
import { registerIconTools } from './tools/icons.js';
import { registerTokenTools } from './tools/tokens.js';
import { registerDocumentationTools } from './tools/documentation.js';
import { registerContextTools } from './tools/context.js';
import { registerIconExportTools } from './tools/icon-exports.js';
import { registerDemoTools } from './tools/demo.js';
import { registerRadixTools } from './tools/radix.js';

// Import all RESOURCES (导入所有人类可用的资源/链接)
import { registerDocResources } from './resources/docs.js';

// 1. Create MCP server instance
export const server = new McpServer({
  name: 'vibeus-design-system-mcp',
  version: '1.0.0', // Updated version for re-adding resources
});

// 2. Register all modules
// (注册所有 AI 工具)
registerUiTools(server);
registerIconTools(server);
registerTokenTools(server);
registerDocumentationTools(server);
registerContextTools(server);
registerIconExportTools(server);
registerDemoTools(server);
registerRadixTools(server);

// (注册所有资源链接)
registerDocResources(server);

// 3. Export the fully configured server
export default server;
