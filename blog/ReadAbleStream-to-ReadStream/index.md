---
slug: ReadAbleStream-to-ReadStream
title: ReadAbleStream 转换为 ReadStream
authors: [1adybug]
date: 2023-11-22
tags: [fetch, ReadAbleStream, ReadStream, response, node.js]
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
    },
})

async function* nodeStreamToIterator(
    stream: ReadStream,
): AsyncGenerator<Buffer, void, never> {
    for await (const chunk of stream) {
        yield chunk
    }
}

function iteratorToStream(
    iterator: AsyncGenerator<Buffer, void, never>,
): ReadableStream {
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next()

            if (done) {
                controller.close()
            } else {
                controller.enqueue(value)
            }
        },
    })
}
```

:::tip

2024 年 3 月 29 日更新

:::

`Node.js` 中其实自带了转换的功能

```typescript
import { Readable } from "stream"

async function main() {
    const response = await fetch("http://example.com")
    const readable = Readable.fromWeb(response.body as any)
}

main()
```
