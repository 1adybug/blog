---
slug: react-strict-mode
title: React Strict Mode
authors: [1adybug]
date: 2025-03-27
tags: [react, strict mode]
---

以下是 `React` 官网的解释：

```markdown
在 `React` 中，`Strict Mode` 是一个用于开发环境的工具，用于帮助开发者发现潜在的问题。它会在开发环境中执行额外的检查，并提供警告信息。

严格模式启用了以下仅在开发环境下有效的行为：

- 组件将 额外重新渲染一次 以查找由于非纯渲染而引起的错误。
- 组件将 额外重新运行一次 `Effect` 以查找由于缺少 `Effect` 清理而引起的错误。
- 组件将 额外重新运行一次 `refs` 回调 以查找由于缺少 `ref` 清理函数而引起的错误。
- 组件将被 检查是否使用了已弃用的 `API`。
```

以下是测试代码：

```typescript
import { FC, useEffect, useMemo, useRef, useState } from "react"

let stateCache: any
let refCache: any
let memoCache: any
let stateCache2: any
let refCache2: any
let memoCache2: any

const App: FC = () => {
    const [state, setState] = useState(() => (console.log("calculate state"), {}))
    const ref = useRef({})
    const memo = useMemo(() => (console.log("calculate memo"), {}), [])

    if (stateCache) console.log(state === stateCache)
    else stateCache = state

    if (refCache) console.log(ref === refCache, ref.current === refCache.current)
    else refCache = ref

    if (memoCache) console.log(memo === memoCache)
    else memoCache = memo

    useEffect(() => {
        if (stateCache2) console.log(state === stateCache2, stateCache === stateCache2)
        else stateCache2 = state

        if (refCache2) console.log(ref === refCache2, ref.current === refCache2.current)
        else refCache2 = ref

        if (memoCache2) console.log(memo === memoCache2, memoCache === memoCache2)
        else memoCache2 = memo
    }, [])

    return <div></div>
}

export default App
```

在 React 18 中，以下是打印结果：

```plaintext
calculate state
calculate memo
calculate state
calculate memo
false
false false
false
true false
true true false false
true false
```

可以看出，组件额外渲染了一次，`state`、`ref`、`memo` 都额外重新获取了一次值，并且返回的第二次获取的新值。

`Effect` 额外运行了一次，但是获取到的 `state`、`ref`、`memo` 的值是相同的，并且是第二次获取的新值

在 React 19 中，以下是打印结果：

```plaintext
calculate state
calculate state
calculate memo
calculate memo
true
true true
true
true true
true true true true
true true
```

可以看出，组件额外渲染了一次，`state`、`ref`、`memo` 都额外重新获取了一次值，然而返回的却是第一次获取的旧值。

`Effect` 额外运行了一次，获取到的 `state`、`ref`、`memo` 的值是依然是相同的，并且是第一次获取的旧值，

以下是 `React` 官网的解释：

```markdown
### StrictMode changes 

React 19 includes several fixes and improvements to Strict Mode.

When double rendering in Strict Mode in development, useMemo and useCallback will reuse the memoized results from the first render during the second render. Components that are already Strict Mode compatible should not notice a difference in behavior.

As with all Strict Mode behaviors, these features are designed to proactively surface bugs in your components during development so you can fix them before they are shipped to production. For example, during development, Strict Mode will double-invoke ref callback functions on initial mount, to simulate what happens when a mounted component is replaced by a Suspense fallback.
```

| 区别 | React 18 | React 19 |
| --- | :---: | :---: |
| 组件额外渲染一次 | √ | √ |
| `state`、`ref`、`memo` 额外重新获取一次值 | √ | √ |
| `render` 阶段获取到的 `state`、`ref`、`memo` 值 | 旧值/新值 | 旧值/旧值 |
| `Effect` 在首次渲染时额外运行一次并且立即执行卸载 | √ | √ |
| `Effect` 阶段获取到的 `state`、`ref`、`memo` 值 | 新值/新值 | 旧值/旧值 |
