---
slug: implement-resumable-file-downloads-in-hono
title: 在 hono 中实现断点续传
authors: [1adybug]
date: 2024-11-18
tags: [hono]
---

```typescript
import { createReadStream } from "fs"
import { stat } from "fs/promises"
import { Readable } from "stream"

import { Hono } from "hono"

const app = new Hono()

function nodeToWebStream(nodeStream: Readable) {
    return new ReadableStream({
        start(controller) {
            // 处理数据块
            nodeStream.on("data", chunk => controller.enqueue(chunk))

            // 处理流结束
            nodeStream.on("end", () => controller.close())

            // 处理错误
            nodeStream.on("error", error => controller.error(error))
        },
        cancel() {
            nodeStream.destroy()
        },
    })
}

app.get("/video", async c => {
    const filename = "demo.mp4"
    const { size } = await stat(filename)
    const headers = new Headers()
    headers.set("Content-Type", "video/mp4")
    const range = c.req.header("Range")

    if (!range) {
        headers.set("Content-Length", String(size))
        return c.newResponse(nodeToWebStream(createReadStream("demo.mp4")), {
            status: 200,
            headers,
        })
    }

    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0])
    const end = parts[1] ? parseInt(parts[1]) : size - 1
    const chunksize = end - start + 1
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`)
    headers.set("Accept-Ranges", "bytes")
    headers.set("Content-Length", String(chunksize))
    return c.newResponse(nodeToWebStream(createReadStream(filename, { start, end })), { status: 206, headers })
})

export default {
    port: 4567,
    fetch: app.fetch,
}
```
