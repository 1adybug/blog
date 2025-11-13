---
slug: replace-with-regexp
title: 使用正则表达式替换字符串
authors: [1adybug]
date: 2024-06-27
tags: [replace, string]
---

当我们使用正则字符串替换字符串时，`replace` 函数的第二个表达式可以传入一个函数，函数的参数含义为：

```typescript
/**
 * 第一个参数为匹配到的字符串
 * 从第二个参数开始为匹配到的所有分组
 * 倒数第二个参数为匹配到的字符串的序列号
 * 最后一个参数为原始字符串
 */
function replacer(match: string, arg1: string, arg2: string, ...args: string[], index: number, str: string): string {}
```
