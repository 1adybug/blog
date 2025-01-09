---
slug: use-ant-design-in-remix
title: 在 Remix 中使用 Ant Design
authors: [1adybug]
date: 2024-06-24
tags: ["antd", "ant design", "remix"]
---

在 `Remix.js` 中使用 `Ant Design` 会出现首次渲染样式丢失的问题，参考 `Ant Design` 官方的解决方案 [整体导出](https://ant-design.antgroup.com/docs/react/server-side-rendering-cn#%E6%95%B4%E4%BD%93%E5%AF%BC%E5%87%BA)

```bash npm2yarn
npm i @ant-design/static-style-extract
npm i cross-env tsx -D
```

```package.json
{
    "scripts": {
        "predev": "tsx ./scripts/genAntdCss.tsx",
        "prebuild": "cross-env NODE_ENV=production tsx ./scripts/genAntdCss.tsx"
    },
    "dependencies": {
        "@ant-design/static-style-extract": "^1.0.2"
    },
    "devDependencies": {
        "cross-env": "^7.0.3",
        "tsx": "^4.15.6"
    }
}
```

```tsx
import fs from "fs"
import { extractStyle } from "@ant-design/static-style-extract"
import { ConfigProvider } from "antd"

const outputPath = "./app/antd.min.css"

const css = extractStyle(node => <ConfigProvider theme={{ token: { colorPrimary: "red" } }}>{node}</ConfigProvider>)

fs.writeFileSync(outputPath, css)
```

```tsx
import "./antd.min.css"
```

如果有自定义主题的需求，只需要传递给 `ConfigProvider` 相应的配置即可：

```tsx
const css = extractStyle(node => <ConfigProvider theme={{ token: { colorPrimary: "red" } }}>{node}</ConfigProvider>)
```

:::warning

这种办法只能是妥协之计，打包出来的 css 文件很大。具体的优化还需要官方实现

:::
