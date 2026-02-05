---
slug: react-compiler-with-tanstack-query
title: 开启 React Compiler 之后的 TanStack Query
authors: [1adybug]
date: 2026-02-05
tags: ["react", "tanstack-query", "react-compiler"]
---

开启 [React Compiler](https://zh-hans.react.dev/learn/react-compiler) 之后，[TanStack Query](https://tanstack.com/query/latest) 的 `select` 方法也会被 React Compiler 优化，详情以下代码在 React Compiler 开启与关闭下的区别：

```tsx
import { FC, useState } from "react"

import { useQuery } from "@tanstack/react-query"

async function getData() {
    return Promise.resolve(123456)
}

const Page: FC = () => {
    const [count, setCount] = useState(0)

    const { data } = useQuery({
        queryKey: ["get-data"],
        queryFn: getData,
        select: () => Date.now(),
    })

    return (
        <div>
            <div>now: {data}</div>
            <div>count: {count}</div>
            <div>
                <button onClick={() => setCount(count + 1)}>add</button>
            </div>
        </div>
    )
}

export default Page
```

当然我的 `soda-tanstack-query` 也是可以享受这个优化的。
