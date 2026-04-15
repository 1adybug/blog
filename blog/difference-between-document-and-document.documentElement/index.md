---
slug: difference-between-document-and-document.documentElement
title: document 和 document.documentElement 之间的区别
authors: [1adybug]
date: 2024-09-18
tags: [document, documentElement]
---

`document` 和 `document.documentElement` 确实有一些重要区别:

1. 定义:
    - `document` 是整个 `HTML` 文档的根节点。
    - `document.documentElement` 是 `HTML` 文档的根元素,通常是 `<html>` 标签。

2. 层级:
    - `document` 是 `DOM` 树的顶层对象。
    - `document.documentElement` 是 `document` 的直接子节点。

3. 属性和方法:
    - `document` 包含许多特有的属性和方法,如 `createElement()`, `getElementById()` 等。
    - `document.documentElement` 主要继承自 `Element` 接口,拥有元素通用的属性和方法。

4. 尺寸获取:
    - 获取视口大小时,通常使用 `document.documentElement.clientWidth/clientHeight`。
    - `document` 本身没有这些尺寸属性。

5. 滚动相关:
    - 处理页面滚动时,常用 `document.documentElement.scrollTop/scrollLeft`。
    - 某些浏览器可能需要使用 `document.body` 而非 `document.documentElement`。

6. DOCTYPE:
    - `document` 包含 `DOCTYPE` 声明。
    - `document.documentElement` 不包含 `DOCTYPE`,仅从 `<html>` 开始。
