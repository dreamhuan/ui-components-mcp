# ui-components-mcp

核心代码在`app/index.ts`和`app/comp-mcp-server/server.ts`  
配合系统提示词一起使用
## 安装依赖

```sh
cp .env.sample .env # 不一定需要，调试使用
yarn
```

## 修改配置

下载代码仓库：

```sh
git clone https://github.com/vibeus/design-system.git # 内部仓库，忽视
git clone https://github.com/radix-ui/website.git
```

修改 app/comp-mcp-server/lib/paths.ts 下的相关路径

## 运行

```sh
yarn dev
```

## 其他
让chat使用mcp能力：https://github.com/srbhptl39/MCP-SuperAssistant
```sh
npx -y @srbhptl39/mcp-superassistant-proxy@latest --config ./mcpconfig.json
```
mcpconfig.json
```
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "~/workspace/chorus/apps/web"
      ]
    },
    "vibeus-design-system": {
      "type": "streamable-http",
      "url": "http://localhost:3333/mcp"
    }
  }
}
```
本地mcp调试工具
```sh
npx @modelcontextprotocol/inspector
```
