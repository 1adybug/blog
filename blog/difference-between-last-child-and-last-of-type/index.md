---
slug: difference-between-last-child-and-last-of-type
title: :last-child 与 :last-of-type 的区别
authors: [1adybug]
date: 2024-12-04
tags: [css]
---

`:last-child` 和 `:last-of-type` 的区别：

1. `:last-child` 选择器

   - 选择父元素中最后一个子元素
   - 无论这个子元素是什么类型
   - 如果最后一个子元素不匹配选择器，则不会被选中

2. `:last-of-type` 选择器

   - 选择父元素中最后一个指定类型的子元素
   - 只关注特定类型的元素
   - 即使是最后一个，但不是指定类型也不会被选中

举个例子：

```html
<div>
  <p>第一段</p>
  <p>第二段</p>
  <span>一个span</span>
</div>
```

- `div p:last-child` 不会选中任何元素（因为最后一个子元素是 `<span>`）
- `div p:last-of-type` 会选中第二个 `<p>` 元素
- `div span:last-of-type` 会选中最后的 `<span>`

简单来说：

- `:last-child` 更严格，要求是最后一个子元素
- `:last-of-type` 更灵活，只要是同类型的最后一个元素

:::tip

`:last-of-type` 只关注元素类型，不关注类名、ID 等属性，所以不会受到这些属性的影响。

比如：

```html
<div>
  <p class="red">第一段</p>
  <p>第二段</p>
  <p>第三段</p>
</div>
```

`div p.red:last-of-type` 不会选中任何元素，因为 `p:last-of-type` 已经选中最后一个 `<p>` 元素，但是这个元素没有 `red` 类名。

:::
