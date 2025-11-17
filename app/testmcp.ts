// import { Client } from '@modelcontextprotocol/sdk/client/index.js';
// import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

// createClient();

// async function createClient() {
//   const args = [
//     'http',
//     'xiaohongshu-mcp',
//     {
//       type: 'http',
//       url: 'http://localhost:18060/mcp',
//       automaticSSEFallback: true,
//       authProvider: undefined,
//       headers: {},
//     },
//   ];
//   const [type, serverName, options] = args;
//   const transport = await createStreamableHTTPTransport(serverName, options);

//   console.log('===transport', transport);
//   const mcpClient = new Client({ name: '@langchain/mcp-adapters', version: '0.6.0' });
//   console.log('===mcpClient', mcpClient);
//   await mcpClient.connect(transport);
//   console.log('===done');
// }

// async function createStreamableHTTPTransport(serverName: any, args: any) {
//   const { url, headers, reconnect, authProvider } = args;
//   const options = {
//     ...(authProvider ? { authProvider } : {}),
//     ...(headers ? { requestInit: { headers } } : {}),
//   } as any;
//   if (reconnect != null) {
//     const reconnectionOptions = {
//       initialReconnectionDelay: reconnect?.delayMs ?? 1e3,
//       maxReconnectionDelay: reconnect?.delayMs ?? 3e4,
//       maxRetries: reconnect?.maxAttempts ?? 2,
//       reconnectionDelayGrowFactor: 1.5,
//     };
//     if (reconnect.enabled === false) reconnectionOptions.maxRetries = 0;
//     options.reconnectionOptions = reconnectionOptions;
//   }

//   return Object.keys(options).length > 0
//     ? new StreamableHTTPClientTransport(new URL(url), options)
//     : new StreamableHTTPClientTransport(new URL(url));
// }

import { MultiServerMCPClient } from '@langchain/mcp-adapters';

const mcpClient = new MultiServerMCPClient({
  useStandardContentBlocks: true,
  mcpServers: {
    // https://github.com/xpzouying/xiaohongshu-mcp
    'xiaohongshu-mcp': {
      url: 'http://localhost:18060/mcp',
      type: 'http',
    },
  },
});

const mcpTools = await mcpClient.getTools();

const toolsByName = Object.fromEntries(mcpTools.map(t => [t.name, t]));

async function main() {
  const topic = '杭州旅游攻略';

  const searchFeeds = toolsByName['search_feeds'];
  const getFeedDetail = toolsByName['get_feed_detail'];

  const feedsRes = await searchFeeds.invoke({
    keyword: topic,
  });
  const getFnList = JSON.parse(feedsRes)
    .feeds.filter((feed: any) => feed.modelType === 'note')
    .slice(0, 3)
    .map((feed: any) => {
      const params = {
        feed_id: feed.id,
        xsec_token: feed.xsecToken,
      };
      console.log(params);
      return () => getFeedDetail.invoke(params);
    });

  // const params = {
  //   feed_id: '68fb4eb70000000007021dcf',
  //   xsec_token: 'ABKOx4JQPVGWd4JUUEQxL5KZUQ4dx2O0skprVW_jjCgAo=',
  // };
  // const res = await getFeedDetail.invoke(params);
  // const shareUrl = `https://www.xiaohongshu.com/discovery/item/${params.feed_id}?xsec_token=${params.xsec_token}`;
  // console.log(res, shareUrl);

  const list = [];
  for (let getDetail of getFnList) {
    if (list.length >= 3) {
      break;
    }
    try {
      const res = await getDetail();
      const info = JSON.parse(res);
      list.push(info.data.note);
    } catch (e: any) {
      console.warn(e?.message);
    }
  }
  console.log(list);
  mcpClient.close();
}

main();
