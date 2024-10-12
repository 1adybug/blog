---
slug: backslash-in-vscode-snippets-regexp
title: 在 VS Code 的代码块的正则表达式中使用反斜杠 "\"
authors: [1adybug]
date: 2024-03-29
tags: [backslash, vscode, snippets, regexp]
---

VS Code 的代码块的正则表达式中使用反斜杠比较繁琐：

```typescript
// 反斜杠，需要使用[]包裹，并且使用 4 个 \
const slug = "${TM_DIRECTORY/[\\\\]//g}"

// 非反斜杠，也需要使用[]包裹，并且使用 4 个 \
const slug = "${TM_DIRECTORY/[^\\\\]//g}"
```

:::tip

最好使用 `[]` 将反斜杠包裹起来

:::
