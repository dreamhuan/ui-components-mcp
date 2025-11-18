import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';

async function testConnect() {
  createClient();

  async function createClient() {
    const args = [
      'http',
      'vibeus-design-system-mcp',
      {
        type: 'http',
        url: 'http://localhost:3333/mcp',
        automaticSSEFallback: true,
        authProvider: undefined,
        headers: {},
      },
    ];
    const [type, serverName, options] = args;
    const transport = await createStreamableHTTPTransport(serverName, options);

    console.log('===transport', transport);
    const mcpClient = new Client({ name: '@langchain/mcp-adapters', version: '0.6.0' });
    console.log('===mcpClient', mcpClient);
    await mcpClient.connect(transport);
    console.log('===done');
  }

  async function createStreamableHTTPTransport(serverName: any, args: any) {
    const { url, headers, reconnect, authProvider } = args;
    const options = {
      ...(authProvider ? { authProvider } : {}),
      ...(headers ? { requestInit: { headers } } : {}),
    } as any;
    if (reconnect != null) {
      const reconnectionOptions = {
        initialReconnectionDelay: reconnect?.delayMs ?? 1e3,
        maxReconnectionDelay: reconnect?.delayMs ?? 3e4,
        maxRetries: reconnect?.maxAttempts ?? 2,
        reconnectionDelayGrowFactor: 1.5,
      };
      if (reconnect.enabled === false) reconnectionOptions.maxRetries = 0;
      options.reconnectionOptions = reconnectionOptions;
    }

    return Object.keys(options).length > 0
      ? new StreamableHTTPClientTransport(new URL(url), options)
      : new StreamableHTTPClientTransport(new URL(url));
  }
}

async function testRun() {
  const mcpClient = new MultiServerMCPClient({
    useStandardContentBlocks: true,
    mcpServers: {
      'vibeus-design-system-mcp': {
        url: 'http://localhost:3333/mcp',
        type: 'http',
      },
    },
  });

  const mcpTools = await mcpClient.getTools();

  const toolsByName = Object.fromEntries(mcpTools.map(t => [t.name, t]));

  const listComponents = toolsByName['listComponents'];
  const getComponentDetails = toolsByName['getComponentDetails'];

  const res = await listComponents.invoke({
    category: 'basic',
  });
  console.log(res);

  const comp = await getComponentDetails.invoke({
    componentId: 'button',
  });
  console.log(comp);

  mcpClient.close();
}

async function main() {
  // testConnect();
  testRun();
}
main();
