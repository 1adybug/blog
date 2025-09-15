---
slug: a-bug-with-react-compiler
title: 记录一次由 React Compiler 引起的 "bug"
authors: [Claude]
date: 2025-09-01
tags: [react, react-compiler]
---

_以下内容均为 `Claude 4 sonnet` 生成_

## 问题背景

最近在项目中启用了 React Compiler 后，遇到了一个令人困惑的问题。一段看似正常的代码在没有启用 React Compiler 时运行良好，但启用后却会在渲染阶段直接崩溃。

## 问题代码

```tsx
import { FC, useState } from "react"

interface Info {
    name: string
    age: number
}

const App: FC = () => {
    const [info, setInfo] = useState<Info | undefined>(undefined)

    function onClick() {
        console.log(info!.name)  // 使用了非空断言
    }

    return <div onClick={onClick} />
}

export default App
```

## 问题现象

启用 React Compiler 后，即使 `onClick` 事件从未被触发，应用也会在渲染过程中直接崩溃，报错：

```
Cannot read property 'name' of undefined
```

## 问题分析

### React Compiler 的工作原理

React Compiler 是一个编译时优化工具，它会：

1. **依赖分析**：分析函数组件中的依赖关系
2. **自动记忆化**：为函数和值自动添加 `useMemo` 和 `useCallback`
3. **代码优化**：重新组织代码以提高性能

### 问题根源

React Compiler 在分析 `onClick` 函数时，发现它引用了 `info.name`，因此将 `info` 作为依赖项。为了优化性能，编译器可能会：

1. 将 `onClick` 函数包装在 `useCallback` 中
2. 将 `info.name` 的访问提前到渲染阶段进行依赖收集
3. 这导致在 `info` 还是 `undefined` 的初始渲染时就尝试访问 `info.name`

### 编译后的大致效果

```tsx
// 编译器可能生成类似这样的代码
const App: FC = () => {
    const [info, setInfo] = useState<Info | undefined>(undefined)
    
    // 编译器为了依赖收集，可能在渲染时就访问了 info.name
    const onClick = useCallback(() => {
        console.log(info!.name)
    }, [info?.name])  // 注意这里的依赖
    
    return <div onClick={onClick} />
}
```

## 解决方案

### 方案一：使用可选链操作符

```tsx
function onClick() {
    console.log(info?.name)  // 使用可选链
}
```

### 方案二：添加条件判断

```tsx
function onClick() {
    if (info) {
        console.log(info.name)
    }
}
```

### 方案三：使用默认值

```tsx
const [info, setInfo] = useState<Info>({ name: '', age: 0 })
```

## 经验总结

### 1. 避免在可能为空的对象上使用非空断言

非空断言 (`!`) 只是告诉 TypeScript 编译器忽略空值检查，但运行时仍可能出错。

### 2. React Compiler 改变了代码执行时机

启用 React Compiler 后，一些原本在事件处理中才会执行的代码可能会在渲染时执行。

### 3. 防御性编程的重要性

始终考虑变量可能为空的情况，使用可选链和条件判断。

### 4. 理解工具的工作原理

了解 React Compiler 等工具的工作机制，有助于预防和解决类似问题。

## 最佳实践建议

1. **启用严格的 TypeScript 配置**：使用 `strict: true` 和 `strictNullChecks: true`

2. **优先使用可选链**：在访问可能为空的对象属性时使用 `?.`

3. **避免过度使用非空断言**：只在确实知道值不为空时使用 `!`

4. **渐进式启用新工具**：在小范围内测试新的编译工具，逐步推广

5. **完善的错误边界**：设置 Error Boundary 来捕获和处理渲染时错误

## 结语

这个案例提醒我们，新的编译优化工具虽然能带来性能提升，但也可能改变代码的执行行为。作为开发者，我们需要：

- 理解工具的工作原理
- 编写更加健壮的代码
- 进行充分的测试
- 保持对新技术的学习和适应

希望这个案例能帮助其他开发者避免类似的问题。
