---
slug: ReadAbleStream-to-ReadStream
title: ReadAbleStream 转换为 ReadStream
authors: [1adybug]
date: 2023-11-22
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

async function* nodeStreamToIterator(stream: ReadStream): AsyncGenerator<Buffer, void, never> {
    for await (const chunk of stream) {
        yield chunk
    }
}

function iteratorToStream(iterator: AsyncGenerator<Buffer, void, never>): ReadableStream {
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next()
            if (done) {
                controller.close()
            } else {
                controller.enqueue(value)
            }
        }
    })
}
```
