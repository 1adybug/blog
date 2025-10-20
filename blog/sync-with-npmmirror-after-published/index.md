---
slug: sync-with-npmmirror-after-published
title: 发布后同步到 npm 镜像
authors: [1adybug]
date: 2024-12-16
tags: [npm, npmmirror]
---

在发布 npm 包后，可以立即在 `npm` 上看到最新的版本，然而 `npmmirror` 等镜像站却有一定的延迟。如果想要立即同步到镜像站，可以使用以下方法：

1. 在项目根目录创建 `scripts` 文件夹，创建 `sync.mjs` 文件

    ```javascript
    // @ts-check

    import { readFile } from "fs/promises"

    /**
     * 将浏览器中直接复制的 headers 转换为对象
     * @param {string} str 复制的 headers
     * @returns {Headers} headers 对象
     */
    function getHeaders(str) {
        const reg = /^(.+?):$\n^(.+?)$/gm
        const reg2 = new RegExp(reg.source, "m")
        const headers = new Headers()
        const match = str.match(reg)
        if (!match) throw new Error("headers 格式错误")

        Array.from(match).forEach(item => {
            const match2 = item.match(reg2)
            headers.set(match2[1], match2[2])
        })

        return headers
    }

    const headers = getHeaders(`accept:
        */*
        accept-encoding:
        gzip, deflate, br, zstd
        accept-language:
        zh-CN,zh;q=0.9,en;q=0.8
        content-length:
        0
        dnt:
        1
        origin:
        https://npmmirror.com
        priority:
        u=1, i
        referer:
        https://npmmirror.com/
        sec-ch-ua:
        "Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"
        sec-ch-ua-mobile:
        ?0
        sec-ch-ua-platform:
        "Windows"
        sec-fetch-dest:
        empty
        sec-fetch-mode:
        cors
        sec-fetch-site:
        same-site
        user-agent:
        Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36`)

    /**
     * 同步包
     * @param {string} packageName 包名
     */
    function syncPackage(packageName) {
        return fetch(
            `https://registry-direct.npmmirror.com/-/package/${packageName}/syncs`,
            {
                headers,
                referrer: "https://npmmirror.com/",
                referrerPolicy: "strict-origin-when-cross-origin",
                method: "PUT",
                mode: "cors",
                credentials: "omit",
            },
        )
    }

    async function main() {
        const packageJson = JSON.parse(await readFile("package.json", "utf-8"))
        await syncPackage(packageJson.name)
    }

    main()
    ```

2. 在 `package.json` 中添加 `sync` 脚本

    ```json
    {
        "scripts": {
            "postpublish": "node scripts/sync.mjs"
        }
    }
    ```
