---
slug: next-middleware-with-node-runtime
title: 使用 Node.js 作为 Next.js 中间件的运行时
authors: [1adybug]
date: 2025-06-06
tags: [nextjs, node, middleware, edge]
---

在 `Next.js` 中，如果你在中间件使用了 `Node.js` 的 `API`， 那么可能会产生以下报错

> Error: The edge runtime does not support Node.js 'crypto' module.

解决方法如下：

1. 安装 `next@canary`
2. 在 `next.config.ts` 中添加以下配置

    ```typescript
    import { NextConfig } from "next"

    const nextConfig: NextConfig = {
        experimental: {
            nodeMiddleware: true,
        },
    }

    export default nextConfig
    ```

3. 在 `middleware.ts` 中添加以下配置

    ```typescript
    export const runtime = "nodejs"
    ```
