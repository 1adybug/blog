---
slug: regexp-width-negative-lookahead
title: 正则表达式负向前瞻
authors: [1adybug]
date: 2024-03-29
tags: [regexp]
---

在正则表达式中，有时候我们需要从一个合集中去掉另一个合集（也就是差集），这时可以利用正则表达式的负向前瞻来实现：

```typescript
/** 从 \w 中去除 \d */
const reg: RegExp = /[(?!\d)\w]/
```
