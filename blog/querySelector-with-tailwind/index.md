---
slug: querySelector-with-tailwind
title: 使用 Tailwind CSS 选择元素
authors: [1adybug]
date: 2024-11-18
tags: [querySelector, tailwind]
---

在 Tailwind 中经常会有一些奇怪的类名，比如 `w-[calc(100vw_-_64px)]`，这种类名是无法直接使用 `document.querySelector` 来选择的，需要进行一些处理，将类名的中 `[]`、`()`、`:` 替换为 `\\[\\]`、`\\(\\)`、`\\:`，然后使用 `document.querySelector` 来选择。

```typescript
className.replace(/([\[\]\(\):])/g, "\\$1")
```
