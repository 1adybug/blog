---
slug: pass-env-to-exec-in-linux
title: 在 linux 中向 exec 传递 env
authors: [1adybug]
date: 2024-08-02
tags: [linux, exec, env]
---

在 linux 中使用 `exec` 执行环境命令并传递 `env` 参数时时，发现很多命令都丢失了：

```TypeScript
import { exec } from "child_process"

// 正常
exec("node -v")

// 报错，提示找不到 node 命令
exec("node -v", {
    env: {
        NODE_ENV: "production",
        NAME: "Tom"
    }
})
```

但是在 windows 中测试，发现正常。求助万能的 `ChatGPT` ，得知，在 linux 中，如果传递了 `env` 参数，所有的环境变量都会被覆盖，所以正确的做法是：

```TypeScript
exec("node -v", {
    env: {
        ...process.env,
        NODE_ENV: "production",
        NAME: "Tom"
    }
})
```

正常，搞定。
