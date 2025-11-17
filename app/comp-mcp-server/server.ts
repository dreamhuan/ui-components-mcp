// app/comp-mcp-server/server.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerUiTools } from './tools/ui.js';
import { registerIconTools } from './tools/icons.js';
import { registerTokenTools } from './tools/tokens.js';
import { registerDocResources } from './resources/docs.js';

// 1. Create MCP server instance
export const server = new McpServer({
  name: 'vibeus-design-system-mcp',
  version: '2.0.0',
});

// 2. Register all modules
registerUiTools(server);
registerIconTools(server);
registerTokenTools(server);
registerDocResources(server);

// 3. Export the fully configured server
export default server;
