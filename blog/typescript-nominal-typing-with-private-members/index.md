---
slug: typescript-nominal-typing-with-private-members
title: TypeScript：如何区分实例与结构相同的对象
authors: [Gemini]
date: 2025-11-13
tags: [typescript]
---

> 以下内容均为 `Gemini 2.5 Pro` 生成

当你在 TypeScript 中定义一个类 (class) 并希望一个函数只接受该类的 _实例_ 时，你可能会遇到一个令人困惑的情况。

假设你有以下代码：

```typescript
class Person {
    name: string

    constructor(name: string) {
        this.name = name
    }

    sayHello() {
        console.log(`Hello, my name is ${this.name}`)
    }
}

function get(a: Person) {
    a.sayHello()
}

// ✅ 没问题，这符合预期
get(new Person("Alice"))

// ❓ 咦？为什么这也行？！
get({ name: "Tom" })
// 错误: Property 'sayHello' is missing in type '{ name: string; }'
// but required in type 'Person'.
```

_（注：在上面的基础示例中，如果 `Person` 类有 `sayHello` 方法，那么 `{ name: "Tom" }` 会报错，因为它缺少该方法。但如果 `Person` 类**只**有 `name` 属性，代码就**不会**报错，这正是问题的核心。）_

让我们用一个更简洁的例子来重现这个问题：

```typescript
class Person {
    name: string

    constructor(name: string) {
        this.name = name
    }
}

function get(a: Person) {
    console.log(a.name)
}

// ✅ 传入实例
get(new Person("Alice"))

// ❌ 为什么这里不报错？
// 我传入了一个对象字面量，而不是 Person 的实例！
get({ name: "Tom" })
```

这到底是怎么回事？这其实是 TypeScript 的一个核心特性在起作用，它被称为 **结构化类型（Structural Typing）**，也常被称作“鸭子类型”。

## 什么是结构化类型？

TypeScript 在比较类型时，并不关心“你叫什么名字”（即名义类型，Nominal Typing），而只关心“你长什么样”（即结构化类型，Structural Typing）。

在上面的例子中：

1.  函数 `get` 期望一个类型为 `Person` 的参数。
2.  `Person` 类型的 _结构_ 被定义为：**“一个拥有 `string` 类型 `name` 属性的对象”**。
3.  我们传入的对象字面量 `{ name: "Tom" }`，它的 _结构_ 也是：**“一个拥有 `string` 类型 `name` 属性的对象”**。

由于两者结构兼容，TypeScript 编译器说：“看起来像一只鸭子，叫起来也像一只鸭子……那它就是一只鸭子。” 于是，编译通过了。

但这并不是我们想要的！我们希望 `get` 函数**只接受**通过 `new Person(...)` 创建的真实实例。那么，如何做到这一点呢？

## 解决方案：使用“私有品牌” (Private Branding)

要强制实现名义类型（即严格限制为类的实例），最简单、最常用的技巧是给类添加一个**私有成员**。

这个私有成员就像一个独一无二的“品牌”标记，只有这个类和它的实例才能拥有。

让我们来修改 `Person` 类：

```typescript
class Person {
    name: string

    // 👇 **这就是关键！**
    // 我们添加了一个私有的 "品牌" 属性
    private _brand!: void

    constructor(name: string) {
        this.name = name
    }
}

function get(a: Person) {
    console.log(a.name)
}

// ✅ 正确：传入 Person 的实例
get(new Person("Alice"))

// ❌ 错误：传入对象字面量
get({ name: "Tom" })
```

现在，当你尝试传入对象字面量时，TypeScript 编译器会立刻报错：

> Argument of type `{ name: string; }` is not assignable to parameter of type `Person`.
> **Property `_brand` is missing** in type `{ name: string; }` but required in type `Person`.

**为什么这样能行？**

- `new Person("Alice")` 创建的实例，其类型签名中**包含** `private _brand: void`。
- `{ name: "Tom" }` 这个对象字面量，其类型签名中**不包含** `_brand` 属性。

因为 `private` 成员是类结构签名的一部分，而对象字面量无法提供这个私有成员，所以 TypeScript 判定它们的结构不兼容，从而达到了我们的目的。

---

## 零运行时成本的“幽灵属性”

你可能会问：“这个 `_brand` 属性会增加我运行时的开销吗？它会存在于我最终的 JavaScript 代码中吗？”

**答案是：完全不会。**

这正是这个技巧最巧妙的地方。让我们来分解这行代码：`private _brand!: void;`

1.  **`private`**：这是一个 TypeScript 的访问修饰符。它**只在编译时有效**，用于类型检查。它会在编译成 JavaScript 时被**完全擦除**。
2.  **`!`** (非空断言)：这是在告诉 TypeScript：“你不用担心这个属性没被初始化，相信我。” 它**只在编译时有效**，用于“安抚”编译器，同样会被**完全擦除**。
3.  **`: void`**：这是一个**纯粹的类型注解**。和所有 TypeScript 中的类型（如 `:string`, `:number`）一样，它会被**完全擦除**。

### 编译对比

**你的 TypeScript (TS)**

```typescript
class Person {
    name: string
    private _brand!: void

    constructor(name: string) {
        this.name = name
    }
}
```

**编译后的 JavaScript (JS)**

```javascript
class Person {
    constructor(name) {
        this.name = name
        // 注意：_brand 在这里完全消失了！
    }
}
```

`_brand` 只是一个“幽灵属性”，它只存在于 TypeScript 的类型系统中，专门用来在编译时“品牌化”你的类。它对运行时的性能和内存占用**没有任何影响**。

## 总结

- **问题**：TypeScript 默认使用**结构化类型**，导致对象字面量可以匹配同结构的类。
- **目标**：我们想强制使用**名义类型**，只接受类的真实实例。
- **解决方案**：在类中添加一个 `private` 属性（如 `private _brand!: void;`）来进行“品牌化”。
- **优势**：此方法**零运行时成本**，所有“品牌”标记都在编译为 JavaScript 时被擦除，只在 TypeScript 类型检查阶段发挥作用。

下次当你需要确保一个参数必须是某个类的实例时，试试这个“私有品牌”技巧吧！
