---
slug: transport-metadata-and-custom-data-with-ai-sdk
title: 通过 AI SDK 发送自定义数据和元数据
authors: [1adybug]
date: 2025-12-25
tags: [vercel, ai-sdk, useChat]
---

Vercel 的 AI SDK 很方便，把前后端的代码都封装起来了，但是有一点不好，就是文档写得不够详细，只介绍了一些初级用法，稍微复杂一点的用法就需要自己去探索。

## UIMessage

`UIMessage` 是 AI SDK 中的消息类型，是最核心的内容。

```typescript
/**
The data types that can be used in the UI message for the UI message data parts.
 */
type UIDataTypes = Record<string, unknown>

type UITools = Record<string, UITool>

/**
AI SDK UI Messages. They are used in the client and to communicate between the frontend and the API routes.
 */
interface UIMessage<METADATA = unknown, DATA_PARTS extends UIDataTypes = UIDataTypes, TOOLS extends UITools = UITools> {
    /**
  A unique identifier for the message.
     */
    id: string
    /**
  The role of the message.
     */
    role: "system" | "user" | "assistant"
    /**
  The metadata of the message.
     */
    metadata?: METADATA
    /**
  The parts of the message. Use this for rendering the message in the UI.
  
  System messages should be avoided (set the system prompt on the server instead).
  They can have text parts.
  
  User messages can have text parts and file parts.
  
  Assistant messages can have text, reasoning, tool invocation, and file parts.
     */
    parts: Array<UIMessagePart<DATA_PARTS, TOOLS>>
}
```

`UIMessage` 接受三个泛型参数：

- `METADATA`：消息的元数据
- `DATA_PARTS`：消息的数据部分
- `TOOLS`：消息的工具

以下使我们创建的一个定义消息类型 `MyUIMessage`

```typescript
export interface Metadata {
    conversationId: string
    messageId: string
    modelIdSnapshot: string
    usedTokens: number
}

// 由于 extends Record<string, unknown> 的限制，DataParts 不能是接口，必须是类型
export type DataParts = {
    timestamp: number
}

export type MyUIMessage = UIMessage<Metadata, DataParts>
```

## METADATA

`metadata` 就是消息的元数据，每一条消息（目前来看只有响应的消息）都可以有 `metadata` 属性，**`metadata` 是附加在消息级别的自定义信息，用于描述消息本身的属性，而不是消息内容的一部分**，我们可以使用 `metadata` 来传递一些额外的信息，比如当前的会话 `id`。

特点：

- 附加在 `message.metadata` 对象上
- 通过 `toUIMessageStreamResponse` 中的 `messageMetadata` 回调发送
- 描述整个消息的属性信息
- 持久化在消息历史中

适用场景:

- 适合存储时间戳、模型信息、token 使用量、用户上下文等消息级别的描述性信息

使用实例：

```typescript
// 服务端
return result.toUIMessageStreamResponse<MyUIMessage>({
    messageMetadata: ({ part }) => {
        if (part.type === "start") {
            return {
                conversationId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
                messageId: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
                modelIdSnapshot: "GPT-5.2",
                usedTokens: 0,
            }
        }

        // 你可以选择更新整个 metadata
        if (part.type === "text") {
            // 由于 metadata 并不限于对象类型，所以并不支持局部更新
            return {
                conversationId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
                messageId: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
                modelIdSnapshot: "GPT-5.2",
                usedTokens: 1,
            }
        }
    },
})

// 客户端访问
console.log(message.metadata)
```
