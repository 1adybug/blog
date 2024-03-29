---
slug: backslash-in-vscode-snippets-regexp
title: 在 VS Code 的代码块的正则表达式中使用反引号 "\"
authors: [1adybug]
date: 2024-03-29
tags: [backslash, vscode, snippets, regexp]
---

VS Code 的代码块的正则表达式中使用反引号比较繁琐：

```typescript
// 反引号，需要使用[]包裹，并且使用 4 个 \
const slug= "${TM_DIRECTORY/[\\\\]//g}"

// 非反引号，也需要使用[]包裹，并且使用 4 个 \
const slug= "${TM_DIRECTORY/[^\\\\]//g}"
```
