// This file remains unchanged as it correctly sets up the Express server
// and delegates MCP requests to the 'server.ts' module.
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
// Note the '.js' extension for ES Module imports
import server from './comp-mcp-server/server.js';

const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on('close', () => {
    transport.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || '3333');
app
  .listen(port, () => {
    // 服务器启动日志
    console.log(`您的本地组件库 MCP 服务器正在运行: http://localhost:${port}/mcp`);
  })
  .on('error', error => {
    console.error('服务器错误:', error);
    process.exit(1);
  });
