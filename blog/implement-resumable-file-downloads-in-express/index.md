---
slug: implement-resumable-file-downloads-in-express
title: 在 Express 中实现断点续传
authors: [1adybug]
date: 2024-11-18
tags: [express]
---

```typescript
import { createReadStream } from "fs"
import { stat } from "fs/promises"

import express from "express"

const app = express()

app.get("/video", async (request, response) => {
    const filename = "demo.mp4"
    const { size } = await stat(filename)
    response.setHeader("Content-Type", "video/mp4")
    const range = request.headers.range

    if (!range) {
        response.setHeader("Content-Length", size)
        response.status(200)
        createReadStream(filename).pipe(response)
        return
    }

    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0])
    const end = parts[1] ? parseInt(parts[1]) : size - 1
    const chunksize = end - start + 1
    response.setHeader("Content-Range", `bytes ${start}-${end}/${size}`)
    response.setHeader("Accept-Ranges", "bytes")
    response.setHeader("Content-Length", chunksize)
    response.status(206)
    createReadStream(filename, { start, end }).pipe(response)
})

app.listen(4567)
```
