---
slug: use-custom-controlled-component-in-form
title: Antd Design 的 Form 中自定义受控组件的使用
authors: [1adybug]
date: 2024-08-02
tags: [Form, antd, Ant Design]
---

自定义或第三方的表单控件，也可以与 `Form` 组件一起使用。只要该组件遵循以下的约定：

1. 提供受控属性 `value` 或其它与 `valuePropName` 的值同名的属性。

2. 提供 `onChange` 事件或 `trigger` 的值同名的事件。

3. 转发 `ref` 或者传递 `id` 属性到 `dom` 以支持 `scrollToField` 方法。

```tsx
import { Button, Form, Input } from "antd"
import FormItem from "antd/es/form/FormItem"
import { ChangeEvent, FC, forwardRef, useState } from "react"

type Info = {
    name?: string
    id?: string
}

type InfoItemProps = {
    value?: Info
    onChange?: (value: Info) => void
}

const InfoItem = forwardRef<HTMLDivElement, InfoItemProps>((props, ref) => {
    const { value, onChange } = props
    const [name, setName] = useState(value?.name)
    const [id, setId] = useState(value?.id)

    function onNameChange(e: ChangeEvent<HTMLInputElement>) {
        setName(e.target.value)
        // 将变化之后的 value 传递给外部，优先级为 state < props < 最新的变化的 value
        onChange?.({ id, ...value, name: e.target.value })
    }

    function onIdChange(e: ChangeEvent<HTMLInputElement>) {
        setId(e.target.value)
        onChange?.({ name, ...value, id: e.target.value })
    }

    return (
        <div ref={ref}>
            {/* 注意：表单元素的 value 优先使用 props 中传递的受控 value，并且只能使用 ??，不能使用 ||，因为 0 或者 "" 之类的值也会被 || 判否 */}
            <Input value={value?.name ?? name} onChange={onNameChange} />
            <Input value={value?.id ?? id} onChange={onIdChange} />
        </div>
    )
})

const App: FC = () => {
    return (
        <Form onFinish={console.dir}>
            <FormItem name="info" initialValue={{ name: "Tom", id: "001" }}>
                <InfoItem />
            </FormItem>
            <FormItem>
                <Button htmlType="submit">Submit</Button>
            </FormItem>
        </Form>
    )
}

export default App
```
