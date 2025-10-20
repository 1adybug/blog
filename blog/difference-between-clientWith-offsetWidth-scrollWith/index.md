---
slug: difference-between-clientWith-offsetWidth-scrollWith
title: clientWidth、offsetWidth、scrollWidth 三者的区别
authors: [1adybug]
date: 2024-12-03
tags: []
---

## clientWidth

- 表示元素的内部宽度
- 包括内容区（content）和内边距（padding）
- 不包括边框（border）、外边距（margin）和滚动条
- 对于内联元素，`clientWidth` 总是返回 `0`

例如一个元素样式如下：

```css
.element {
    width: 100px;
    padding: 10px;
    border: 5px solid black;
}
```

则 `clientWidth = 120px (content 100px + padding 20px)`

## offsetWidth

- 表示元素的布局宽度
- 包括内容区（content）、内边距（padding）和边框（border）
- 不包括外边距（margin）
- 包括滚动条宽度（如果有）

继续上面的例子：

`offsetWidth = 130px (content 100px + padding 20px + border 10px)`

## scrollWidth

- 表示元素内容的完整宽度，包括因超出元素宽度而不可见的部分
- 如果元素内容没有超出可视区域，则等于 `clientWidth`
- 如果内容超出可视区域，则等于实际内容宽度加上内边距

举个例子：

```javascript
// 如果一个容器宽度为 200px，但内容实际宽度为 300px
const container = document.querySelector(".container")

console.log(container.clientWidth) // 200px

console.log(container.scrollWidth) // 300px
```

这些属性的主要应用场景：

- `clientWidth`：计算元素的可视内容区域
- `offsetWidth`：获取元素实际占用的布局空间
- `scrollWidth`：检测内容是否溢出，实现横向滚动功能

## 总结

在实际开发中如何选择：

1. 需要判断元素是否需要滚动时，比较 `scrollWidth` 和 `clientWidth`
2. 需要获取元素实际占用空间时，使用 `offsetWidth`
3. 需要获取元素可视内容区域时，使用 `clientWidth`

需要注意的是，这些值都是只读的，如果需要修改元素尺寸，应该使用 CSS 的 `width`、`padding` 等属性。
