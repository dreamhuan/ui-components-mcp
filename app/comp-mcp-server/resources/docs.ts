// app/comp-mcp-server/resources/docs.ts
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

// Function to register all documentation-related resources
export function registerDocResources(server: McpServer) {
  // [Resource 1: UI Docs]
  server.registerResource(
    'componentDocs',
    new ResourceTemplate('docs://vibeus/components/{name}'),
    {
      title: 'Vibeus UI 组件文档',
      description: '获取指定 Vibeus UI 组件的在线文档 URL。',
    },
    async (uri, { name }) => {
      const docUrl = `https://vibe-design-system.vercel.app/docs/${name}`;
      return {
        contents: [
          {
            uri: uri.href,
            text: `组件 ${name} 的在线文档地址是: ${docUrl}`,
          },
        ],
      };
    }
  );

  server.registerResource(
    'componentRadixUIDocs',
    new ResourceTemplate('docs://radix-ui/components/{name}'),
    {
      title: 'Radix UI 组件文档',
      description: '获取指定 Radix UI 组件的在线文档 URL。',
    },
    async (uri, { name }) => {
      const docUrl = `https://www.radix-ui.com/primitives/docs/components/${name}`;
      return {
        contents: [
          {
            uri: uri.href,
            text: `RadixUI 组件 ${name} 的在线文档地址是: ${docUrl}`,
          },
        ],
      };
    }
  );

  // [Resource 2: Icon Docs]
  server.registerResource(
    'iconDocs',
    new ResourceTemplate('docs://vibeus/icons'), // Static URI
    {
      title: 'Vibeus 图标库文档',
      description: '获取 Vibeus 图标库的在线文档 URL。',
    },
    async uri => {
      const docUrl = 'https://vibe-design-system.vercel.app/docs/icon';
      return {
        contents: [
          {
            uri: uri.href,
            text: `图标库的在线文档地址是: ${docUrl}`,
          },
        ],
      };
    }
  );
}
