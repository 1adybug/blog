---
slug: declare-global-var
title: 在 TypeScript 中声明全局变量
authors: [1adybug]
date: 2024-06-24
tags: ["typescript"]
---

有时我们需要声明一些全局变量或者模块，此时我们可以使用 `declare` 方法来实现：

在 `.d.ts` 或者 `ts` 文件中：

```TypeScript
declare global {
    var tip: string
}
```

:::warning

1. `.d.ts` 文件中不能有 `import` 语句，否则它会变成模块
2. `ts` 文件必须被引入，或者是入口文件

:::

对于浏览器打包的项目，还可以添加 window 上的变量

```TypeScript
declare global {
    var tip: string

    interface Window {
        tip: string
    }
}

window.tip = "This is a tip."
```

:::warning

必须使用 `interface` 来扩展声明

:::
