---
slug: node-forward-request
title: Node 转发请求
authors: [1adybug]
date: 2023-11-22
tags: [http, ReadStream, response, node.js]
---

```ts
// response 就是 ReadStream
http.get("http://localhost:3000/hello", response => {
  response.pipe(res)
})
```
