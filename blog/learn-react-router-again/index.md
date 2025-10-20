---
slug: learn-react-router-again
title: 重新学习 React Router
authors: [1adybug]
date: 2025-05-09
tags: [react, react-router, remix]
---

## 前言

`React Router` 在推出 `Remix` 后变成了一个全栈框架，在 `V7` 版本之后，更是将 `React Router` 和 `Remix` 合并在一起，提供了一个全栈的解决方案。

## 常见问题

1. `loader` 和 `clientLoader` 有什么区别？
    - 执行环境
        - `loader`: 在服务器端执行
        - `clientLoader`: 在客户端(浏览器)执行

    - 运行时机
        - `loader`: 在页面初始加载和每次导航时在服务器上运行
        - `clientLoader`: 在客户端导航时运行，首次页面加载时不执行

    - 数据获取能力
        - `loader`: 可以访问服务器资源（数据库、文件系统、内部API等）
        - `clientLoader`: 只能访问浏览器可用的资源（如公共API、localStorage等）

    - 安全性
        - `loader`: 可以包含敏感逻辑和凭证，因为代码不会发送到客户端
        - `clientLoader`: 所有代码会发送到浏览器，不应包含敏感信息

    - 用途场景
        - `loader`: 适用于需要服务器权限或敏感数据的操作
        - `clientLoader`: 适用于提升客户端导航体验，减轻服务器负担的场景

    这两个函数通常可以配合使用：`loader` 用于初始数据加载和服务器相关操作，`clientLoader` 用于优化后续的客户端导航体验。

    `loader` 将在你首次打开页面就是这个路由时执行，`clientLoader` 将在你由其他路由导航到这个路由时执行。`clientLoader` 在首次页面加载时不会执行。在 `clientLoader` 中，你可以使用 `serverLoader` 调用 `loader`

    ```tsx
    // route("products/:pid", "./product.tsx");
    import { fakeDb } from "../db"
    import type { Route } from "./+types/product"

    export async function loader({ params }: Route.LoaderArgs) {
        return fakeDb.getProduct(params.pid)
    }

    export async function clientLoader({
        serverLoader,
        params,
    }: Route.ClientLoaderArgs) {
        const res = await fetch(`/api/products/${params.pid}`)
        const serverData = await serverLoader()
        return { ...serverData, ...res.json() }
    }

    export default function Product({ loaderData }: Route.ComponentProps) {
        const { name, description } = loaderData

        return (
            <div>
                <h1>{name}</h1>
                <p>{description}</p>
            </div>
        )
    }
    ```
