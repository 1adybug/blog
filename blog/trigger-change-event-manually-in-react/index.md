---
slug: trigger-change-event-manually-in-react
title: 在 react 中手动触发 change 事件
authors: [1adybug]
date: 2024-10-22
tags: [react, change]
---

在 `react` 中存在很多受控组件，比如 `input`、`textarea` 等，一般来说，受控组件将会是如下写法：

```tsx
import { FC } from "react"

const App: FC = () => {
    const [value, setValue] = useState("")

    return <input value={value} onChange={e => setValue(e.target.value)} />
}

export default App
```

这种写法在 `react` 内部使用没有任何问题，但是对于外部使用者来说却存在很多问题，比如：

```tsx
import { FC, useState } from "react"

const App: FC = () => {
    const [value, setValue] = useState("")

    return (
        <div>
            <div>
                <label htmlFor="input">input:</label>
                <input id="input" value={value} onChange={e => setValue(e.target.value)} />
            </div>
            <div>value:{value}</div>
        </div>
    )
}

export default App
```

当我们使用如下代码来更改 `input` 的值：

```typescript
input.value = "123456"
```

却看到输入框的值发生了更改，下方的文本却没有任何变化，说明我们更改 `input` 的值的行为并没有触发 `react` 内部的 `change` 事件，那我们来手动触发 `change` 和 `input` 事件：

```typescript
const changeEvent = new Event("change", { bubbles: true })
const inputEvent = new Event("input", { bubbles: true })

input.dispatchEvent(changeEvent)
input.dispatchEvent(inputEvent)
```

可以看到，下方文本任然没有任何变化，Google 一番终于找到了正确答案 [Simulate React On-Change On Controlled Components](https://hustle.bizongo.in/simulate-react-on-change-on-controlled-components-baa336920e04)：

```typescript
const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set

set?.call(input, "123456")

const inputEvent = new Event("input", { bubbles: true })

input.dispatchEvent(inputEvent)
```

下方的文本成功同步！
