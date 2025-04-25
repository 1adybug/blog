---
slug: scrollbar-style
title: 设置滚动条样式
authors: [1adybug]
date: 2024-06-14
tags: [css, scrollbar]
---

很多时候，我们希望设置滚动条的样式，但是设置的前提是，我们设置了滚动条的宽度：

```css
/* 设置滚动条的整体样式 */
::-webkit-scrollbar {
    /* 滚动条的宽度，纵向滚动时有效 */
    width: 12px;
    /* 滚动条的高度，横向滚动时有效 */
    height: 12px;
}

/* 设置滚动条滑块的样式 */
::-webkit-scrollbar-thumb {
    /* 滑块的颜色 */
    background-color: rgba(0, 0, 0, 0.25);
    /* 滑块的圆角 */
    border-radius: 6px;
}

/* 当鼠标悬停在滑块上时，改变滑块的颜色 */
::-webkit-scrollbar-thumb:hover {
    /* 滑块的颜色 */
    background: rgba(0, 0, 0, 0.45);
}

/* 设置滚动条轨道的样式 */
::-webkit-scrollbar-track {
    /* 滚动条轨道的颜色 */
    background: rgba(0, 0, 0, 0.05);
    /* 滚动条轨道的圆角 */
    border-radius: 6px;
}
```
