// app/index.ts
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
// 注意 ES Module 导入需要 '.js' 扩展名
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
    console.log(
      `Your local component library MCP server is running at: http://localhost:${port}/mcp`
    );
  })
  .on('error', error => {
    console.error('Server error:', error);
    process.exit(1);
  });
