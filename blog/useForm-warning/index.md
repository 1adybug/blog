---
slug: useForm-warning
title: useForm 警告
authors: [1adybug]
date: 2024-09-04
tags: [ant design, useForm]
---

在使用 `Ant Design` 的 `Form` 表单时，经常会遇到这个警告：

:::warning

Warning: Instance created by \`useForm\` is not connected to any Form element. Forget to pass \`form\` prop?

:::

如果确定传递了 `form` 属性，那么一般是由于调用 `form` 实例的方法时，`Form` 表单还没有被渲染的原因，常见于 `Modal` 中嵌套的 `Form`，解决办法为监听弹窗是否被打开：

```ts
useEffect(() => {
  if (!open) return
  form.setFieldsValue({})
}, [open, form])
```
