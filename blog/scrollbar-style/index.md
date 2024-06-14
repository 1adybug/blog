---
slug: scrollbar-style
title: 设置滚动调样式
authors: [1adybug]
date: 2024-06-14
tags: [css, scrollbar]
---

很多时候，我们希望设置滚动条的样式，但是设置的前提是，我们设置了滚动条的宽度：

```css
/* 设置滚动条的整体样式 */
::-webkit-scrollbar {
    width: 12px; /* 滚动条的宽度 */
}

/* 设置滚动条滑块的样式 */
::-webkit-scrollbar-thumb {
    background-color: #888; /* 滑块的颜色 */
    border-radius: 6px; /* 滑块的圆角 */
}

/* 设置滚动条轨道的样式 */
::-webkit-scrollbar-track {
    background: #f1f1f1; /* 滚动条轨道的颜色 */
    border-radius: 6px; /* 滚动条轨道的圆角 */
}

/* 当鼠标悬停在滑块上时，改变滑块的颜色 */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}
```
