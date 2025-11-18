// app/comp-mcp-server/resources/docs.ts
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

// 注册所有文档相关的资源
export function registerDocResources(server: McpServer) {
  // [资源 1: UI 文档]
  server.registerResource(
    'componentDocs',
    new ResourceTemplate('docs://vibeus/components/{name}'),
    {
      title: 'Vibeus UI Component Docs',
      description: 'Get the online documentation URL for a specific Vibeus UI component.',
    },
    async (uri, { name }) => {
      const docUrl = `https://vibe-design-system.vercel.app/docs/${name}`;
      return {
        contents: [
          {
            uri: uri.href,
            text: `The online documentation URL for component ${name} is: ${docUrl}`,
          },
        ],
      };
    }
  );

  // [资源 2: Radix UI 文档]
  server.registerResource(
    'componentRadixUIDocs',
    new ResourceTemplate('docs://radix-ui/components/{name}'),
    {
      title: 'Radix UI Component Docs',
      description: 'Get the online documentation URL for a specific Radix UI component.',
    },
    async (uri, { name }) => {
      const docUrl = `https://www.radix-ui.com/primitives/docs/components/${name}`;
      return {
        contents: [
          {
            uri: uri.href,
            text: `The online documentation URL for RadixUI component ${name} is: ${docUrl}`,
          },
        ],
      };
    }
  );

  // [资源 3: 图标库文档]
  server.registerResource(
    'iconDocs',
    new ResourceTemplate('docs://vibeus/icons'), // 静态 URI
    {
      title: 'Vibeus Icon Library Docs',
      description: 'Get the online documentation URL for the Vibeus Icon library.',
    },
    async uri => {
      const docUrl = 'https://vibe-design-system.vercel.app/docs/icon';
      return {
        contents: [
          {
            uri: uri.href,
            text: `The online documentation URL for the icon library is: ${docUrl}`,
          },
        ],
      };
    }
  );
}
