---
slug: use-https-in-express
title: 在 Express 中使用 https 证书
authors: [1adybug]
date: 2023-11-27
tags: [node.js, https, express]
---

```typescript
import { readFileSync, readdirSync } from "fs"
import https from "https"
import express from "express"

const app = express()

app.get("/", async (req, res) => {
    res.send("Hello, World!")
})

https
    .createServer(
        {
            key: readFileSync("../root/.acme.sh/a.deep-sea.dynv6.net_ecc/a.deep-sea.dynv6.net.key"),
            cert: readFileSync("../root/.acme.sh/a.deep-sea.dynv6.net_ecc/fullchain.cer"),
        },
        app,
    )
    .listen(8080)
```
