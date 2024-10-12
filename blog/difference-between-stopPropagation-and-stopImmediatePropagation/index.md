---
slug: difference-between-stopPropagation-and-stopImmediatePropagation
title: stopPropagation 和 stopImmediatePropagation 之间的区别
authors: [1adybug]
date: 2024-10-12
tags: []
---

在 `JavaScript` 中，`stopPropagation` 和 `stopImmediatePropagation` 是两个用于控制事件传播的方法。它们之间有一些关键的区别。

## stopPropagation

`stopPropagation` 方法用于阻止事件冒泡到下一个元素，但允许其他事件处理程序在当前元素上继续执行。例如，如果你在一个按钮的点击事件中调用 `stopPropagation`，点击事件将不会冒泡到按钮的父元素，但该按钮上的其他点击事件处理程序仍然会被执行。

```ts
element.addEventListener("click", function (event) {
  event.stopPropagation()
  console.log("Button clicked")
})
```

## stopImmediatePropagation

`stopImmediatePropagation` 方法不仅阻止事件冒泡，还阻止当前元素上所有后续的事件处理程序执行。这意味着一旦调用了 `stopImmediatePropagation`，当前元素上的其他事件处理程序将不会被触发。

```ts
element.addEventListener("click", function (event) {
  event.stopImmediatePropagation()
  console.log("Button clicked")
})

element.addEventListener("click", function (event) {
  console.log("This will not be logged")
})
```

## 何时使用

- 使用 `stopPropagation` 当你只想阻止事件冒泡但仍希望当前元素上的其他事件处理程序执行时。
- 使用 `stopImmediatePropagation` 当你希望完全停止事件传播并阻止当前元素上的所有后续事件处理程序执行时。

了解这两个方法的区别可以帮助你更好地控制事件流，从而实现更复杂的用户交互逻辑。
