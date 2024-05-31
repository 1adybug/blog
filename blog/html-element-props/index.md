---
slug: html-element-props
title: HTML 元素 props
authors: [1adybug]
date: 2024-05-31
tags: [react, ComponentProps, HTMLAttributes]
---

很多时候我们会有元素标签上显示的属性来获取元素的 `props`

```TypeScript
import { HTMLAttributes } from "react"

type MyDivProps = HTMLAttributes<HTMLDivElement>
```

但其实，`React` 内置更为方便的泛型工具 `ComponentProps`

```TypeScript
import { ComponentProps } from "react"

type MyDivProps = ComponentProps<"div">
```

`HTMLAttributes<HTMLDivElement>` 和 `ComponentProps<"div">` 的区别在于，后者包含了 `ref` 和 `key` 属性
