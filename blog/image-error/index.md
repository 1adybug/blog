---
slug: image-error
title: 处理图片错误
authors: [1adybug]
date: 2024-03-12
tags: [image, HTMLImageElement, img, onError, error]
---

在项目中经常会使用到第三方的图床，这些图床的图片可能会出错，统一处理错误就很有必要：

```typescript
window.addEventListener(
    "error",
    e => {
        const { target } = e

        // 判断是否是图片元素的错误
        if (!(target instanceof HTMLImageElement)) return

        const url = new URL(target.src)

        // 判断是否是第三方的图片
        if (url.origin === location.origin) return

        // 添加 data-error-image 属性
        target.dataset.errorImage = ""
    },
    true,
)
```

```css
[data-error-image] {
    position: relative;
}

[data-error-image]::before {
    content: "视图库服务器";
    font-family: "AlibabaPuHuiTi";
    position: absolute;
    width: 100%;
    height: 50%;
    background-color: brown;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: flex-end;
}

[data-error-image]::after {
    content: "传递图片失败";
    font-family: "AlibabaPuHuiTi";
    position: absolute;
    width: 100%;
    height: 50%;
    background-color: brown;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}
```

:::tip

即使后续图片加载成功了也不用担心，伪元素会被隐藏

:::
