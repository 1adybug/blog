---
slug: use-required-mark-in-form
title: Ant Design 的 Form 中 requiredMark 的使用
authors: [1adybug]
date: 2024-08-02
tags: [antd, Ant Design, Form, requiredMark]
---

之前一直都是使用 `css` 来实现必填组件的 `*` 号的隐藏，没想到 `Ant Design` 官方提供了修改的方法：

```tsx
import { InfoCircleOutlined } from "@ant-design/icons"
import { Button, Form, Input, Radio, Tag } from "antd"
import { useForm } from "antd/es/form/Form"
import FormItem from "antd/es/form/FormItem"
import React, { FC, Fragment, useState } from "react"

type RequiredMark = boolean | "optional" | "customize"

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
  <Fragment>
    {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
    {label}
  </Fragment>
)

const App: FC = () => {
  const [form] = useForm()
  const [requiredMark, setRequiredMarkType] = useState<RequiredMark>("optional")

  const onRequiredTypeChange = ({ requiredMarkValue }: { requiredMarkValue: RequiredMark }) => {
    setRequiredMarkType(requiredMarkValue)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ requiredMarkValue: requiredMark }}
      onValuesChange={onRequiredTypeChange}
      requiredMark={requiredMark === "customize" ? customizeRequiredMark : requiredMark}
    >
      <FormItem label="Required Mark" name="requiredMarkValue">
        <Radio.Group>
          <Radio.Button value>Default</Radio.Button>
          <Radio.Button value="optional">Optional</Radio.Button>
          <Radio.Button value={false}>Hidden</Radio.Button>
          <Radio.Button value="customize">Customize</Radio.Button>
        </Radio.Group>
      </FormItem>
      <FormItem label="Field A" required tooltip="This is a required field">
        <Input placeholder="input placeholder" />
      </FormItem>
      <FormItem label="Field B" tooltip={{ title: "Tooltip with customize icon", icon: <InfoCircleOutlined /> }}>
        <Input placeholder="input placeholder" />
      </FormItem>
      <FormItem>
        <Button type="primary">Submit</Button>
      </FormItem>
    </Form>
  )
}

export default App
```

`requiredMark` 有四种可以传递的值：

1. `true` 默认值

2. `false` 不显示是否必填

3. `"optional"` 在可选表单项的 `label` 后面添加 `(可选)`

4. `(label: ReactNode, { required }: { required: boolean }) => ReactNode` 自定义渲染函数
