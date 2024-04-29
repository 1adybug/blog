---
slug: assert-type
title: Node 中引入 json 文件
authors: [1adybug]
date: 2024-02-23
tags: [node.js, import, json]
---

在 `js` 中直接引入 `json` 文件会报错，必须加一个后缀：

```TypeScript
import packageJson from "../package.json" assert { type: "json" }
```
