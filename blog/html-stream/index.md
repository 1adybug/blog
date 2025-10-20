---
slug: html-stream
title: HTML 流式传输
authors: [1adybug]
date: 2024-12-09
tags: [html, stream]
---

```typescript
import { createServer } from "http"

const server = createServer(async (request, response) => {
    response.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Transfer-Encoding": "chunked",
    })

    response.write(`
        <!DOCTYPE html>
        <html>
            <body>
                <h2 id="loading">Loading...</h2>
    `)

    const response2 = await fetch("https://dog.ceo/api/breeds/image/random")
    const data = await response2.json()

    response.write(`
                <img src="${data.message}" alt="random dog" />
                <script>
                    document.getElementById("loading").remove()
                </script>
            </body>
        </html>
    `)

    response.end()
})

server.listen(3000, () =>
    console.log("Server is running on http://localhost:3000"))
```
