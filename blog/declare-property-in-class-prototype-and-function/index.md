---
slug: declare-property-in-class-prototype-and-function
title: 在类的原型或者函数自身声明属性
authors: [1adybug]
date: 2024-08-30
tags: [class, prototype, function, typescript]
---

## 声明 class 的 prototype 上存在某个属性

1. 接口扩展

    ```TypeScript
    interface Person {
        sayName(): void
    }

    class Person {
        constructor(public name: string) {}
    }

    Person.prototype.sayName = function sayName() {
        console.log(this.name)
    }

    const person = new Person("Tom")

    person.sayName()
    ```

2. 声明合并

    ```TypeScript
    class Person {
        constructor(public name: string) {}
    }

    interface Person {
        sayName(): void
    }

    Person.prototype.sayName = function sayName() {
        console.log(this.name)
    }

    const person = new Person("Tom")

    person.sayName()
    ```

方法1和方法2看起来似乎只是 `class` 和 `interface` 的顺序区别，以下是 `claude` 给出的解释：
主要区别：

1. 声明顺序：

    在接口扩展中，我们先声明接口，后声明类。
    在声明合并中，我们先声明类，后声明接口。

2. 语义和意图：

    接口扩展更像是在定义一个契约，然后让类去实现这个契约。
    声明合并更像是在已有的类上添加额外的属性或方法。

3. 使用场景：

    接口扩展通常用于你预先知道类需要实现某些属性或方法时。
    声明合并通常用于你想要在已有的类上添加新的属性或方法，尤其是在处理第三方库或 legacy 代码时。

4. 灵活性：

    声明合并提供了更大的灵活性，因为你可以在代码的不同部分逐步扩展类的定义。
    接口扩展要求你在一个地方定义所有的接口成员。

5. 代码组织：

    接口扩展可能导致更清晰的代码结构，因为所有的类型信息都在一个地方。
    声明合并允许你在需要的地方添加类型信息，这在某些情况下可能更方便。

实际上，这两种方法在功能上是等价的。`TypeScript` 编译器会以相同的方式处理它们。选择使用哪种方法主要取决于你的代码风格偏好和具体的使用场景。

在实际开发中，声明合并（第二种方法）可能更常用，特别是在需要扩展现有类或处理第三方库时。但是，如果你正在从头开始设计一个新的类，使用接口扩展（第一种方法）可能会让你的意图更加清晰。

## 声明函数自身存在某些属性

现在可以直接声明属性了：

```TypeScript
const Bar = () => console.log("Hello World")

Bar.color = "red"

console.log(Bar.color)

function Foo() {
  console.log("Hello World")
}

Foo.color = "red"

console.log(Foo.color)
```
