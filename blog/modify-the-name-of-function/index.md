---
slug: modify-the-name-of-function
title: 修改函数的名称
authors: [1adybug]
date: 2024-10-12
tags: [function]
---

函数的名称在定义时已经被确定，比如：

```typescript
function foo() {}

// 打印 "foo"
console.log(foo.name)
```

然而，匿名函数或者箭头函数的名称是空字符串：

```typescript
const foo = (() => function () {})()

// 打印 ""
console.log(foo.name)
```

之所以要写成 `(() => function () {})()` 这么奇怪的形式，是应为使用 `var`、`let` 或 `const` 定义的变量名会赋值给函数的名称：

```typescript
const foo = function () {}

// 打印 "foo"
console.log(foo.name)

const bar = () => 0

// 打印 "bar"
console.log(bar.name)
```

变量定义时，属性名也会被赋值给函数的名称：

```typescript
const obj = {
    foo: function () {},
    bar: () => 0,
}

// 打印 "foo"
console.log(obj.foo.name)

// 打印 "bar"
console.log(obj.bar.name)
```

然而，后续的赋值操作不会影响函数的名称：

```typescript
const obj = {}

obj.foo = function () {}

// 打印 ""
console.log(obj.foo.name)

const name = "bar"
obj[name] = () => 0

// 打印 ""
console.log(obj.bar.name)
```

然而，更有趣的是，定义对象字面量时，动态的属性名会被赋值给属性名：

```typescript
const name = "foo"

const obj = {
    [name]: function () {},
}

// 打印 "foo"
console.log(obj[name].name)
```

最后，如果你想修改函数的名称，可以使用 `Object.defineProperty`：

```typescript
const foo = function () {}
Object.defineProperty(foo, "name", { value: "bar" })

// 打印 "bar"
console.log(foo.name)
```
