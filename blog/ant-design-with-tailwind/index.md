---
slug: ant-design-with-tailwind
title: Ant Design 与 Tailwind 的样式冲突问题
authors: [1adybug]
date: 2024-03-01
tags: [ant design, antd, tailwind]
---

> [参考 Ant Design 官网：样式兼容](https://ant-design.antgroup.com/docs/react/compatible-style-cn)

`Ant Design` 的 `CSS-in-JS` 默认通过 `:where` 选择器降低 `CSS Selector` 优先级，以减少用户升级时额外调整自定义样式的成本，不过 `:where` 语法的兼容性在低版本浏览器比较差。在某些场景下你如果需要支持旧版浏览器（或与 `TailwindCSS` 优先级冲突），你可以使用 `@ant-design/cssinjs` 取消默认的降权操作（请注意版本保持与 `antd` 一致）：

```tsx
import { FC } from "react"
import { StyleProvider } from "@ant-design/cssinjs"

// `hashPriority` 默认为 `low`，配置为 `high` 后，
// 会移除 `:where` 选择器封装
const App: FC = () => (
    <StyleProvider hashPriority="high">
        <MyApp />
    </StyleProvider>
)

export default App
```

切换后，样式将从 `:where` 切换为类选择器：

```css
:where(.css-bAMboO).ant-btn {
}

.css-bAMboO.ant-btn {
    color: #fff;
}
```
