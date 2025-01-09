---
slug: npm-install-latest
title: 使用 npm 安装最新的包
authors: [1adybug]
date: 2025-01-08
tags: [npm, bun, powershell]
---

有时候我们在更新了自己的 `npm` 包之后，需要立即在项目中进行更新，但是 `registry` 上的包并没有及时更新。这时候我们可以使用 `npm i` 命令的 `@latest` 标记配合 `--registry https://registry.npmjs.com` 来安装最新的包。

```bash npm2yarn
npm i soda-next@latest --registry https://registry.npmjs.com
```

使用 `PowerShell`，可以在 `$PROFILE` 中配置：

```powershell npm2yarn
function inpm {
    $package = $args | ForEach-Object { "$_@latest" }
    npm i $package --registry=https://registry.npmjs.org
}
```
