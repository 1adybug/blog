---
slug: default-parameter-value
title: 函数默认参数值
authors: [1adybug]
date: 2026-02-05
tags: ["typescript", "default-parameter-value"]
---

一直以来有一个很困惑的问题，那就是函数的默认参数值是动态创建的么？测试一下：

```typescript
function get(value: number[] = []) {
    return value
}

const a = get()
const b = get()

console.log(a === b)
```

结果是 `false`，所以函数的默认参数值是动态创建的。

同理，解构赋值也是动态创建的：

```typescript
interface Info {
    data?: number[]
}

const info: Info = {}

function getData({ data = [] }: Info) {
    return data
}

const c = getData(info)
const d = getData(info)

console.log(c === d)
```

结果是 `false`，所以解构赋值也是动态创建的。
