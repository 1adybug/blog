---
slug: limit-class-type
title: 限制类的类型
authors: [1adybug]
date: 2024-08-30
tags: [class, typescript]
---

有的时候我们希望函数的参数能够是某一种类，有两种办法限制这种参数：

1. 使用 `typeof`：

    ```typescript
    class Person {
        constructor(public name: string) {}
    }

    function createPerson(constructor: typeof Person) {
        return new constructor("Tom")
    }

    const person = createPerson(Person)
    ```

2. 使用 `new`：

    ```typescript
    class Person {
        constructor(public name: string) {}
    }

    function createPerson(constructor: new (name: string) => Person) {
        return new constructor("Tom")
    }

    const person = createPerson(Person)
    ```

    或者，扩展一下：

    ```typescript
    interface Animal {
        name: string
    }

    class Person {
        constructor(public name: string) {}
    }

    function createAnimal(constructor: new (name: string) => Animal) {
        return new constructor("Tom")
    }

    const person = createAnimal(Person)
    ```

这里我们可以学到，只要在一个函数类型的前面加一个 `new` 关键字，便变成了构造函数
