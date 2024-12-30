---
slug: defining-and-reusing-object-types-in-jsdoc
title: 在 jsdoc 中定义和复用对象类型
authors: [1adybug]
date: 2024-12-30
tags: [jsdoc]
---

我来介绍几种在 JSDoc 中定义和复用对象类型的方法：

1. 使用 `@typedef` 定义类型：

    ```javascript
    /**
     * @typedef {Object} User
     * @property {string} name - 用户名
     * @property {number} age - 年龄
     * @property {string} [email] - 可选的邮箱
     */

    /**
     * 创建新用户
     * @param {User} userData - 用户数据
     * @returns {User}
     */
    function createUser(userData) {
        // ...
    }
    ```

2. 使用 `@typedef` 定义嵌套对象：

    ```javascript
    /**
     * @typedef {Object} Address
     * @property {string} street
     * @property {string} city
     */

    /**
     * @typedef {Object} UserWithAddress
     * @property {string} name
     * @property {Address} address - 用户地址
     */

    /**
     * @param {UserWithAddress} user
     */
    function printUserAddress(user) {
        // ...
    }
    ```

3. 使用 `@callback` 定义包含函数的对象类型：

    ```javascript
    /**
     * @typedef {Object} ConfigOptions
     * @property {string} baseUrl
     * @property {function(Error): void} onError - 错误处理回调
     */

    /**
     * @param {ConfigOptions} config
     */
    function initialize(config) {
        // ...
    }
    ```

4. 继承和扩展已有类型：

    ```javascript
    /**
     * @typedef {Object} BaseConfig
     * @property {string} env - 环境变量
     */

    /**
     * @typedef {BaseConfig} ProductConfig
     * @property {string} productId - 产品ID
     */

    /**
     * @param {ProductConfig} config
     */
    function setupProduct(config) {
        // ...
    }
    ```

5. 使用命名空间组织类型：

    ```javascript
    /**
     * @namespace API
     */

    /**
     * @typedef {Object} API.RequestConfig
     * @property {string} url
     * @property {string} method
     */

    /**
     * @typedef {Object} API.Response
     * @property {number} status
     * @property {*} data
     */

    /**
     * @param {API.RequestConfig} config
     * @returns {Promise<API.Response>}
     */
    function request(config) {
        // ...
    }
    ```

这些类型定义可以在整个项目中重复使用。一些实用建议：

- 将常用的类型定义放在单独的文件中，例如 `types.js`
- 为复杂对象添加详细的属性描述
- 使用 `@property` 的可选标记 `[]` 来表示可选属性
- 用命名空间避免类型名称冲突
- IDE（如 VSCode）会根据这些类型定义提供代码提示

这样可以让你的代码更容易维护，并提供更好的开发体验。
