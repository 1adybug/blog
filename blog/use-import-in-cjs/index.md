---
slug: use-import-in-cjs
title: 在 Common JS 中使用 ES Module
authors: [1adybug]
date: 2024-03-04
tags: [common js, cjs, es module, esm, require, import, dynamic import]
---

在 `Node.JS` 的 `Common JS` 中是无法使用 `import A from "a"` 或者 `const a = require("a")` 来导入一个 `ES Module` 的，这个时候就需要使用 `dynamic import` 功能，注意 `Common JS` 不支持顶级 `await`：

```typescript
async function main() {
    const { default: A } = await import("a")
}
```
