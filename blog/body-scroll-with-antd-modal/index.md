---
slug: body-scroll-with-antd-modal
title: body 设置为 overflow: scroll 时，antd modal 打开后会被改为 overflow: hidden
authors: [1adybug]
date: 2024-12-03
tags: [antd]
---

在某个项目中，为了让每个页面的宽度一致，不因滚动条而发生突变，设置 `body` 为 `overflow: scroll` 时

然而发现 `antd` 的 `Modal` 组件打开后，`body` 会被改为 `overflow: hidden`，导致页面滚动条消失。这是因为 `antd` 的 `Modal` 组件会在打开时给 `body` 添加一个 `overflow: hidden` 的样式，关闭时再移除，这会导致页面的宽度发生变化，观感不好

但是某些页面的 `Modal` 打开后又会自动添加 `padding-right`，不会让页面宽度发生变化，这是因为 `antd` 的 `Modal` 组件在打开时会判断页面是否有滚动条，如果有滚动条，会给 `body` 添加一个 `padding-right`，这样页面的宽度就不会发生变化

获取页面滚动条的宽度也很简单：

```typescript
const width = document.documentElement.offsetWidth - document.documentElement.clientWidth
```
