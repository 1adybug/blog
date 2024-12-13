---
slug: return-with-void
title: 使用 void 操作符返回
authors: [1adybug]
date: 2024-12-13
tags: [void]
---

有的时候，某些函数类的参数类型是 `() => (undefined | SomeType)`，如果我们使用箭头函数的话，就会出现返回类型不匹配的情况，比如：

```typescript
import { useEffect } from "react"

useEffect(() => setTimeout(() => console.log("Hello"), 1000), [])
```

这时候，编辑器会给我们报错 `不能将类型“Timeout”分配给类型“void | Destructor”`，我们可以使用 `{}` 将 `console.log("Hello")` 包裹起来：

```typescript
import { useEffect } from "react"

useEffect(
    () =>
        setTimeout(() => {
            console.log("Hello")
        }, 1000),
    [],
)
```

但是这样的话，代码会变得很臃肿，我们可以使用 `void` 操作符来解决这个问题：

```typescript
import { useEffect } from "react"

useEffect(() => void setTimeout(() => console.log("Hello"), 1000), [])
```

大功告成！
