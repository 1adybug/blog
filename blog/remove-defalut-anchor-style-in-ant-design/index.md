---
slug: remove-defalut-anchor-style-in-ant-design
title: 移除 Ant Design 中默认的 a 元素样式
authors: [1adybug]
date: 2024-12-13
tags: [ant design, antd, css]
---

`Ant Design` 总是会给 `a` 元素设置默认样式，这样会导致在使用 `a` 元素时，样式不符合我们的预期。比如在 `a` 元素中设置了 `color` 为 `red`，但是在 `Ant Design` 中，`a` 元素的默认样式是 `blue`，这样就会导致我们的样式被覆盖。可以用以下方式去除默认样式：

```css
a[href],
a[href]:active,
a[href]:hover {
    color: inherit;
}
```
