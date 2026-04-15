---
slug: difference-among-contentRect-contentBoxSize-and-blockBoxSize
title: contentRect、contentBoxSize 和 borderBoxSize 之间的区别
authors: [1adybug]
date: 2025-02-10
tags: [ResizeObserver, contentRect, contentBoxSize, borderBoxSize]
---

这些尺寸属性之间的主要区别如下：

1. contentRect：
    - 表示元素的内容区域的尺寸
    - 不包含内边距（padding）和边框（border）
    - 是最内层的测量值

2. contentBoxSize：
    - 与contentRect测量相同的区域
    - 同样只包含内容区域的尺寸
    - 主要区别在于返回值的格式不同：contentBoxSize返回一个包含width和height的对象

3. borderBoxSize：
    - 测量元素的完整尺寸
    - 包含内容区域、内边距和边框
    - 是最外层的测量值
    - 计算公式：内容区域 + `padding * 2` + `border * 2`
    - `inlineSize`：沿着文本方向的尺寸，一般为 `width`
    - `blockSize`：垂直于文本方向的尺寸，一般为 `height`

这些属性在实际应用中的使用场景：

- contentRect/contentBoxSize：当你需要知道元素实际内容区域大小时使用，比如计算文本区域
- borderBoxSize：当你需要知道元素在页面上占据的总空间时使用，比如布局计算

如果你对某个具体的使用场景有疑问，或者想要了解更多细节，请随时告诉我
