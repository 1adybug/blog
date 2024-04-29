---
slug: use-fetch-with-proxy
title: 在 Node.js 中为 fetch 配置代理
authors: [1adybug]
date: 2024-03-29
tags: [fetch, node-fetch, https-proxy-agent, proxy, node.js]
---

在 `Node.js` 中，原生的 `fetch` API 并不直接支持代理功能。可以使用 [node-fetch](https://www.npmjs.com/package/node-fetch) 库和 [https-proxy-agent](https://www.npmjs.com/package/https-proxy-agent) 库来实现通过代理服务器发送请求的功能：

```TypeScript
import fetch from "node-fetch"
import { HttpsProxyAgent } from "https-proxy-agent"

// 代理服务器的URL
const proxyUrl = "http://your-proxy-server:port"

// 目标URL，即你想要通过代理服务器访问的URL
const targetUrl = "http://example.com"

// 配置代理服务器
const proxyAgent = new HttpsProxyAgent(proxyUrl)

// 使用fetch发起请求，通过代理服务器访问目标URL
fetch(targetUrl, { agent: proxyAgent })
```

:::warning

与原生的 `fetch` 不同，`node-fetch` 的 `response.json()` 返回值类型为 `Promise<unknown>`

:::
