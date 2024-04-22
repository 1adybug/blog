---
slug: check-package
title: 检查依赖中的包
authors: [1adybug]
date: 2024-04-22
tags: [npm, yarn, react, jsx, node_modules, package.json]
---

有时候，项目中可能会存在某个隐藏的依赖，又或者存在同一个依赖的多个版本，这时候我们可以通过以下命令来检查依赖来源：

```powershell
# yarn
yarn why @types/react
# npm
npm ls @types/react
```

当项目中存在多个版本的 `@types/react` 时，可能或报错：

> 不能用作 JSX 组件, 不是有效的 JSX 元素

这时我们可以在 `package.json` 中配置 `resolutions` 统一 `@types/react` 版本：

```json
{
    "resolutions": {
        "@types/react": "^18.2.79"
    }
}
```
