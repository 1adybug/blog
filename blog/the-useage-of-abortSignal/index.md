---
slug: the-useage-of-abortSignal
title: AbortSignal 的用法
authors: [1adybug]
date: 2024-10-28
tags: [abortSignal]
---

对于 `AbortSignal`，我们常见的用法应该是用于取消 `fetch` 请求：

```typescript
const controller = new AbortController()
const signal = controller.signal

fetch(url, { signal })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))

// 取消请求
controller.abort()
```

但是 `AbortSignal` 还有其他的用法，比如用于取消事件监听：

```typescript
useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    window.addEventListener("click", () => console.log("click"), { signal })
    return () => {
        controller.abort()
    }
}, [])
```

当然，更高效的用法是取消多个事件监听

`AbortSignal` 类还有两个静态方法 `AbortSignal.timeout` 和 `AbortSignal.any`

`AbortSignal.timeout` 用于设置超时时间，在指定时间后会自动取消：

```typescript
const signal = AbortSignal.timeout(1000)
```

类似于：

```typescript
const controller = new AbortController()
const signal = controller.signal
setTimeout(() => controller.abort(), 1000)
```

`AbortSignal.any` 用于多个 `AbortSignal` 任意一个触发时取消：

```typescript
const controller = new AbortController()
const controller2 = new AbortController()
const signal = AbortSignal.any([controller.signal, controller2.signal])
```
