---
slug: declare-process-env
title: 声明环境变量
authors: [1adybug]
date: 2024-08-21
tags: [node, process, env]
---

```TypeScript
declare namespace NodeJS {
    interface ProcessEnv {
        TOKEN?: string
    }
}
```
