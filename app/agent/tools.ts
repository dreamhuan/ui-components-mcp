import z from 'zod/v3';
import { StructuredTool, tool } from '@langchain/core/tools';
import { TavilyCrawl, TavilySearch } from '@langchain/tavily';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';

export const mcpClient = new MultiServerMCPClient({
  useStandardContentBlocks: true,
  mcpServers: {
    'comp-mcp-server': {
      transport: 'http',
      url: 'http://localhost:3333/mcp',
    },
  },
});

const mcpTools = await mcpClient.getTools();

// Define tools
const add: StructuredTool = tool(({ a, b }) => a + b, {
  name: 'add',
  description: 'Add two numbers',
  schema: z.object({
    a: z.number().describe('First number'),
    b: z.number().describe('Second number'),
  }),
});

const subtract: StructuredTool = tool(({ a, b }) => a - b, {
  name: 'subtract',
  description: 'Subtract two numbers',
  schema: z.object({
    a: z.number().describe('First number'),
    b: z.number().describe('Second number'),
  }),
});

const multiply: StructuredTool = tool(({ a, b }) => a * b, {
  name: 'multiply',
  description: 'Multiply two numbers',
  schema: z.object({
    a: z.number().describe('First number'),
    b: z.number().describe('Second number'),
  }),
});

const divide: StructuredTool = tool(({ a, b }) => a / b, {
  name: 'divide',
  description: 'Divide two numbers',
  schema: z.object({
    a: z.number().describe('First number'),
    b: z.number().describe('Second number'),
  }),
});

export const tavilySearchTool: StructuredTool = new TavilySearch({
  tavilyApiKey: process.env.VITE_TAVILY_API_KEY,
  maxResults: 3,
  // topic: 'general',
  // includeAnswer: false,
  // includeRawContent: false,
  // includeImages: false,
  // includeImageDescriptions: false,
  // searchDepth: "basic",
  // timeRange: "day",
  // includeDomains: [],
  // excludeDomains: [],
}) as unknown as StructuredTool;

export const tavilyCrawlTool: StructuredTool = new TavilyCrawl({
  tavilyApiKey: process.env.VITE_TAVILY_API_KEY,
  maxDepth: 2,
  maxBreadth: 5,
  // extractDepth: "basic",
  // format: "markdown",
  limit: 10,
  // includeImages: false,
  // allowExternal: false,
}) as unknown as StructuredTool;

// https://docs.langchain.com/oss/javascript/integrations/tools/index#tools-and-toolkits
export const tools: StructuredTool[] = [
  add,
  subtract,
  multiply,
  divide,
  tavilySearchTool,
  tavilyCrawlTool,
  ...mcpTools,
];

export const toolsByName = Object.fromEntries(tools.map(t => [t.name, t]));
