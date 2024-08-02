---
slug: use-formlist-in-form
title: Ant Design 中 FormList 的使用
authors: [1adybug]
date: 2024-08-02
tags: []
---

有时候在我们的表单中可能存在动态增删的情况，比如需要登记报名的人员，人员的数量是不确定的，每个人员都要登记姓名和身份证号，这便是动态表单。

## 简单的动态表单

```tsx
import { Button, Form, Input } from "antd"
import FormItem from "antd/es/form/FormItem"
import FormList from "antd/es/form/FormList"
import { FC, Fragment } from "react"

const App: FC = () => {
    return (
        <Form onFinish={console.dir}>
            <FormList name="hobbies" initialValue={["钓鱼"]}>
                {(fields, { add }) => (
                    <Fragment>
                        {fields.map(({ key, name }) => (
                            <FormItem key={key} name={name}>
                                <Input />
                            </FormItem>
                        ))}
                        <Button onClick={() => add()}>Add</Button>
                    </Fragment>
                )}
            </FormList>
            <Button htmlType="submit">Submit</Button>
        </Form>
    )
}

export default App
```

在这个表单中，`hobbies` 字段是动态的，使用起来也非常简单，但是有以下注意点：

1. `FormList` 不接受泛型参数，直接给它传递动态的字段名即可，这里是 `hobbies`

2. `FormList` 的 `initialValue` 就是初始值，如果，你希望初始时就有一个输入框呈现，可以传入 `[undefined]`

3. **`initialValue` 的每一项都会传递给 `FormItem`，继而传递给内部的表单元素。所以，必须传递相应类型的值**，比如 `Input` 组件可以接受的初始值是 `string | undefined`，那 `initialValue` 可以接受的类型就是 `(string | undefined)[]`，而 `RangePicker` 可以接受的初始值是 `[Dayjs | null, Dayjs | null] | undefined`，那 `initialValue` 可以接受的类型就是 `([Dayjs | null, Dayjs | null] | undefined)[]`

4. `FormList` 接受一个函数作为 `children`。函数的有三个参数：`fields`、`operation` 和 `meta`

5. `fields` 是一个由 `field` 组成的数组，用于渲染动态表单的每一个子元素。

6. `field` 有两个属性 `key` 和 `name`，都是用于直接传递给 `FormItem`。注意不能直接使用 `{...field}` 的形式。因为 `React` 组件的 `key` 属性必须显式地声明，也就是必须是 `key={key}` 的形式。

7. `opertion` 有三个属性 `add`、`remove` 和 `move` 属性。

8. `add` 是一个用于添加表单数量的方法，接受两个参数 `defaultValue` 和 `insertIndex`。`defaultValue` 会传递给新增的 `FormItem`。与第 3 点类似，初始值的类型必须匹配。`insertIndex` 用于设置插入的位置。**不能使用 `<Button onClick={add}>Add</Button>` 的形式**，因为 `onClick` 是传递参数 `MouseEvent` 的，只能使用 `<Button onClick={() => add()}>Add</Button>`

9. `remove` 是一个用于删除某个表单的方法，接受一个参数 `index`，可以是 `number` 也可以是 `number[]`，对应 `field` 中的 `name`

10. `move` 是一个用于移动表单的方法，接受两个参数 `from` 和 `to`，都对应 `field` 中的 `name`

## 嵌套的动态表单

```tsx
import { Button, Form, Input } from "antd"
import FormItem from "antd/es/form/FormItem"
import FormList from "antd/es/form/FormList"
import { FC, Fragment } from "react"

const App: FC = () => {
    return (
        <Form onFinish={console.dir}>
            <FormList name="persons" initialValue={[{ name: "Tom", age: "18" }]}>
                {(fields, { add }) => (
                    <Fragment>
                        {fields.map(({ key, name }) => (
                            <Fragment key={key}>
                                <FormItem name={[name, "name"]} label="姓名">
                                    <Input />
                                </FormItem>
                                <FormItem name={[name, "age"]} label="年龄">
                                    <Input />
                                </FormItem>
                            </Fragment>
                        ))}
                        <Button onClick={() => add()}>Add</Button>
                    </Fragment>
                )}
            </FormList>
            <Button htmlType="submit">Submit</Button>
        </Form>
    )
}

export default App
```

有时候，我们动态的表单可能不止一项属性，可能存在多个属性，属性中可能还有多个属性，这时便是嵌套的动态表单，这与简单的动态表单有以下几点不同：

1. `name` 属性无法直接使用，必须是使用 `[name, "age"]` 这种路径数组的形式

2. `initialValue` 也不再是 `valueType[]` 的形式，而是 `{ name: valueType }[]` 的形式

3. `FormList` 也可以再次嵌套 `FormList`：

    ```tsx
    <FormList name="persons">
        {fields => fields.map(({name}) => (
            <FormItem label="爱好">
                <FormList name={[name, "hobbies"]} initialValue={["钓鱼"]}>
                    {(fields, { add }) => (
                        <Fragment>
                            {fields.map(({ key, name }) => (
                                <FormItem key={key} name={name}>
                                    <Input />
                                </FormItem>
                            ))}
                            <Button onClick={() => add()}>Add</Button>
                        </Fragment>
                    )}
                </FormList>
            </FormItem>
        ))}
    </FormList>
    ```
