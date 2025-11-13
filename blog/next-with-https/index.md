---
slug: next-with-https
title: 在 next.js 中使用 https
authors: [1adybug]
date: 2024-02-23
tags: [next, next.js, https]
---

```typescript
import { readFileSync } from "fs"
import { createServer } from "https"
import { join } from "path"

import next from "next"

const app = next({})
const handle = app.getRequestHandler()

// https 证书相关
const key = readFileSync(join("/etc/letsencrypt/live", "yourdomain.com", "privkey.pem"), "utf8")

const cert = readFileSync(join("/etc/letsencrypt/live", "yourdomain.com", "cert.pem"), "utf8")
const ca = readFileSync(join("/etc/letsencrypt/live", "yourdomain.com", "chain.pem"), "utf8")

app.prepare().then(() => {
    createServer({ key, cert, ca }, (req, res) => {
        handle(req, res)
    }).listen(3000)
})
```
