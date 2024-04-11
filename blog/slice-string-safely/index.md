---
slug: slice-string-safely
title: 安全切割字符串
authors: [1adybug]
date: 2024-04-11
tags: []
---

在 `JavaScript` 中，由于某些 emoji 表情是使用两个 Unicode 码点组成的，也就是说它们是由一对代理对（surrogate pair）表示的。这意味着这些 emoji 表情在 `JavaScript` 字符串中实际上会占用两个字符的位置。如果直接使用 `slice()` 方法来截取包含这类 emoji 的字符串，可能会导致 emoji 被错误地切割，导致无法正确显示。

为了解决这个问题，可以通过将字符串转换为一个能够正确处理 Unicode 扩展字符的形式（如使用 `Array.from()` 或者扩展运算符 `...` 将字符串转换为数组），然后对数组进行操作，最后再将其转换回字符串。这样做可以确保即使是占用两个字符位置的 emoji 也能被正确处理。

以下是一个示例代码，展示了如何安全地截取包含 emoji 的字符串：

```typescript
// 原始字符串，其中包含占用两个字符位置的 emoji
const originalString = "Hello 👋 World 🌍!"

// 使用 Array.from() 将字符串转换为数组，以正确处理每个 Unicode 字符
const characters = Array.from(originalString)

// 安全地截取字符串，这里以截取前 8 个 Unicode 字符为例
const sliced = characters.slice(0, 8).join("")

console.log(sliced) // 输出结果应为 "Hello 👋"
```

在这个例子中，`Array.from(originalString)` 生成了一个数组，每个元素都是 `originalString` 的一个 Unicode 字符，包括那些占用两个字符位置的 emoji。然后，你可以像处理普通数组一样处理这个字符数组，例如使用 `slice()` 方法。最后，使用 `join("")` 方法将数组元素合并成一个新的字符串。

这种方法可以确保即使是复杂的 Unicode 字符（如那些由代理对组成的 emoji）也能被正确处理，避免了因直接使用 `slice()` 方法而导致的潜在问题。
