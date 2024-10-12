---
slug: use-prettier-in-markdown
title: 在 Markdown 中使用 Prettier
authors: [1adybug]
date: 2024-10-12
tags: [prettier, markdown]
---

`prettier` 也支持 `Markdown` 文件的格式化，但是有以下注意点：

1. 中文用户可以安装插件 [prettier-plugin-lint-md](https://www.npmjs.com/package/prettier-plugin-lint-md)
2. `JavaScript` 代码块语言标识需要改为 `javascript` 或者 `js`，`TypeScript` 改为 `typescript` 或者 `ts`，驼峰命名的语言标识需要改为全小写，否则 `prettier` 无法识别
3. `tabWidth` 要设置为 `2`，否则 `Markdown` 文件中的文本缩进会有问题
