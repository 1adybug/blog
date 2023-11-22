---
slug: ReadAbleStream-to-ReadStream
title: ReadAbleStream 转换为 ReadStream
authors: [1adybug]
date: 2023-11-22
toc_min_heading_level: 2
toc_max_heading_level: 3
tags: [fetch, ReadAbleStream, ReadStream, response, node]
---

```typescript
import { Readable } from "stream"

const reader = readAbleStream.getReader()
const readStream = new Readable({
    read() {
        reader.read().then(({ done, value }) => {
            if (done) {
                readStream.push(null)
            } else {
                readStream.push(value)
            }
        })
    }
})
```
