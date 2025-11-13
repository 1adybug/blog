---
slug: extract-antd-css-on-demand-with-ssr
title: 在 SSR 中按需提取 Ant Design CSS
authors: [1adybug]
date: 2024-12-09
tags: [ssr, antd, css, remix, react router]
---

## 使用方法

在 `react router`（或者 `remix`）中使用 `Ant Design` 时，如果不对 `css` 进行处理，会导致首屏样式丢失的问题。之前介绍过整体导入的解决方案 [在 Remix 中使用 Ant Design](/use-ant-design-in-remix)，但是这种方式会导致打包出来的 `css` 文件很大。本文介绍一种更优雅的解决方案：在 `SSR` 中按需提取 `Ant Design` 的 `css`：

1. 需要在项目中暴露 `entry.client.tsx` 和 `entry.server.tsx`，如果已经暴露了，可以跳过这一步：

    ```bash npm2yarn
    npx react-router reveal
    ```

2. 安装相应依赖：

    ```bash npm2yarn
    npm i @ant-design/cssinjs @ant-design/static-style-extract
    ```

3. 在 `root.tsx` 中放入 `__ANTD_STYLE_PLACEHOLDER__`：

    ```tsx
    const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined"

    const isDev = process.env.NODE_ENV === "development"

    export const Layout: FC<PropsWithChildren> = ({ children }) => (
        <html lang="zh">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
                {/** 如果需要在开发环境开启，去除 !isDev */}
                {!isBrowser && !isDev && "__ANTD_STYLE_PLACEHOLDER__"}
            </head>
            <body>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: "#FF0000",
                        },
                    }}
                >
                    {children}
                </ConfigProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
    ```

4. 修改 `entry.client.tsx`：

    ```tsx
    import { startTransition, StrictMode } from "react"
    import { hydrateRoot } from "react-dom/client"
    import { HydratedRouter } from "react-router/dom"

    import { legacyLogicalPropertiesTransformer, StyleProvider } from "@ant-design/cssinjs"

    startTransition(() => {
        hydrateRoot(
            document,
            <StrictMode>
                <StyleProvider transformers={[legacyLogicalPropertiesTransformer]} hashPriority="high">
                    <HydratedRouter />
                </StyleProvider>
            </StrictMode>,
        )
    })
    ```

5. 修改 `entry.server.tsx`：

    ```tsx
    import { createReadableStreamFromReadable } from "@react-router/node"
    import { type RenderToPipeableStreamOptions, renderToPipeableStream } from "react-dom/server"
    import { type AppLoadContext, type EntryContext, ServerRouter } from "react-router"

    import { PassThrough } from "node:stream"

    import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs"
    import { isbot } from "isbot"

    const ABORT_DELAY = 5_000

    export default function handleRequest(
        request: Request,
        responseStatusCode: number,
        responseHeaders: Headers,
        routerContext: EntryContext,
        loadContext: AppLoadContext,
    ) {
        return new Promise((resolve, reject) => {
            let shellRendered = false
            const userAgent = request.headers.get("user-agent")

            const fromBot = !!userAgent && isbot(userAgent)

            // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
            // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
            const readyOption: keyof RenderToPipeableStreamOptions = (userAgent && isbot(userAgent)) || routerContext.isSpaMode ? "onAllReady" : "onShellReady"

            const cache = createCache()

            const { pipe, abort } = renderToPipeableStream(
                <StyleProvider cache={cache}>
                    <ServerRouter context={routerContext} url={request.url} abortDelay={ABORT_DELAY} />
                </StyleProvider>,
                {
                    [readyOption]() {
                        shellRendered = true

                        const body = new PassThrough({
                            transform(chunk, encoding, callback) {
                                chunk = String(chunk).replace("__ANTD_STYLE_PLACEHOLDER__", fromBot ? "" : extractStyle(cache))
                                callback(null, chunk)
                            },
                        })

                        const stream = createReadableStreamFromReadable(body)

                        responseHeaders.set("Content-Type", "text/html")

                        resolve(
                            new Response(stream, {
                                headers: responseHeaders,
                                status: responseStatusCode,
                            }),
                        )

                        pipe(body)
                    },
                    onShellError(error: unknown) {
                        reject(error)
                    },
                    onError(error: unknown) {
                        responseStatusCode = 500

                        // Log streaming rendering errors from inside the shell.  Don't log
                        // errors encountered during initial shell rendering since they'll
                        // reject and get logged in handleDocumentRequest.
                        if (shellRendered) {
                            console.error(error)
                        }
                    },
                },
            )

            setTimeout(abort, ABORT_DELAY)
        })
    }
    ```

## 原理分析

1. 首先是在服务端的 HTML 代码中插入了 `__ANTD_STYLE_PLACEHOLDER__`

    ```typescript
    !isBrowser && !isDev && "__ANTD_STYLE_PLACEHOLDER__"
    ```

2. 然后是将 antd 的样式抽取为 `style` 标签

    ```tsx
    const cache = createCache()

    renderToPipeableStream(
        <StyleProvider cache={cache}>
            <ServerRouter context={routerContext} url={request.url} abortDelay={ABORT_DELAY} />
        </StyleProvider>,
    )

    const css = extractStyle(cache)
    ```

3. 将 `__ANTD_STYLE_PLACEHOLDER__` 替换为抽取的 `style` 标签

    ```typescript
    chunk = String(chunk).replace("__ANTD_STYLE_PLACEHOLDER__", fromBot ? "" : extractStyle(cache))
    ```
