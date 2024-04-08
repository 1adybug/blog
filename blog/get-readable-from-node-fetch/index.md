---
slug: get-readable-from-node-fetch
title: 从 node-fetch 的响应中获取 readable
authors: [1adybug]
date: 2024-04-08
tags: [node-fetch, node, readable, readableStream]
---

`node-fetch` 的 `response.body` 虽然类型标记为 `ReadableStream`，但实际上并不是，被 `Readable.fromweb` 调用时会报错，此时改为使用 `Readable.from` 即可成功。

```typescript
import fetch from "node-fetch"

const response = await fetch("http://somewhere.com")

// ❌ 会报错
const readable = Readable.fromweb(response.body!)

// ✅ 不会报错
const readable = Readable.fromweb(response.body!)
```
