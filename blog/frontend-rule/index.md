---
slug: frontend-rule
title: 前端守则
authors: [1adybug]
date: 2024-05-30
tags: []
---

## 技术栈

|     类型     |                                                                           要求                                                                           |
| :----------: | :------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    编辑器    |                                                   [Visual Studio Code](https://code.visualstudio.com/)                                                   |
|    浏览器    |                                              [Chrome](https://www.google.com/intl/en/chrome/?standalone=1)                                               |
|     语言     |                                                      [TypeScript](https://www.typescriptlang.org/)                                                       |
|    UI 库     |                                                           [React](https://zh-hans.react.dev/)                                                            |
|    组件库    |             [Ant Design](https://ant-design.antgroup.com/index-cn) / [Deepsea Components](https://www.npmjs.com/package/deepsea-components)              |
|    脚手架    |                                             [Rsbuild](https://rsbuild.dev/zh/) / [Next](https://nextjs.org/)                                             |
|     路由     |                                                     [React Router](https://reactrouter.com/en/main)                                                      |
|   包管理器   |                                                               [Yarn](https://yarnpkg.com/)                                                               |
|   时间处理   |                                                           [Day.js](https://day.js.org/zh-CN/)                                                            |
|     CSS      |                         [Tailwind](https://tailwindcss.com/docs/installation) / [Emotion](https://emotion.sh/docs/introduction)                          |
|    hooks     |                                                          [ahooks](https://ahooks.js.org/zh-CN/)                                                          |
|   状态共享   | [ahooks](https://ahooks.js.org/zh-CN/) / [Soda Hooks](https://www.npmjs.com/package/soda-hooks) / [React Soda](https://www.npmjs.com/package/react-soda) |
|   网络请求   |                                             [fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/fetch)                                              |
|   数据验证   |                                                                 [Zod](https://zod.dev/)                                                                  |
|  数据库管理  |                                                             [Prisma](https://www.prisma.io/)                                                             |
|    移动端    |                                                          [Capacitor](https://capacitorjs.com/)                                                           |
| 移动端组件库 |                                                   [Ionic](https://ionicframework.com/docs/components)                                                    |
|  代码格式化  |                                  [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)                                  |

## 要求

1. 所有 `React` 组件必须使用以下形式书写：

   ```tsx
   // 无参数组件
   import { FC } from "react"

   const Component: FC = () => {
     return <div></div>
   }

   export default Component

   // 有参数组件
   import { FC } from "react"

   export type ComponentProps = {}

   const Component: FC<ComponentProps> = props => {
     const {} = props

     return <div></div>
   }

   export default Component
   ```

2. 全局共享状态优先使用 [ahooks](https://ahooks.js.org/zh-CN/) 实现，其次 [React Soda](https://www.npmjs.com/package/react-soda) ：

   ```TypeScript
   import { useRequest } from "ahooks"

   export function useCount() {
       return useRequest(() => Promise.resolve(Math.random()), {
           cacheKey: "abc"
       })
   }
   ```

   :::warning

   [ahooks](https://ahooks.js.org/zh-CN/) 在 `StrictMode` 下有 Bug，需要关闭严格模式

   :::

   ```TypeScript
   import createStore from "react-soda"

   export const useCount = createStore(0)
   ```

3. CSS 样式优先使用 [Tailwind](https://tailwindcss.com/docs/installation) 实现，其次 [Emotion](https://emotion.sh/docs/introduction) 或者行内样式实现。

   :::warning

   - [Tailwind](https://tailwindcss.com/docs/installation) 不支持动态属性，如 \`bg-$\{color\}\`
   - 尽量不要在 [Emotion](https://emotion.sh/docs/introduction) 中书写动态样式，[Emotion](https://emotion.sh/docs/introduction) 生成的样式不会被自动清除。如果有动态需求，可以使用 CSS 变量 `var(--name)` 搭配行内样式实现

   :::

4. 对于 [Ant Design](https://ant-design.antgroup.com/index-cn) 的样式修改尽量通过修改[主题](https://ant-design.antgroup.com/docs/react/customize-theme-cn)来实现
5. 对于表单查询的参数使用 [Soda Hooks](https://www.npmjs.com/package/soda-hooks) 中的 `useQueryState` 来存储和控制

   ```TypeScript
   import { useQueryState } from "soda-hooks"

   const [query, setQuery] = useQueryState({
       keys: ["name", "unit"],
       parse: {
           age: value => value ? Number(value) : undefined
       }
   })
   ```

6. 在项目根目录配置 [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)：

   ```js
   // prettier.config.cjs
   module.exports = {
     // tailwind 格式化插件
     plugins: ["prettier-plugin-tailwindcss"],
     semi: false,
     tabWidth: 4,
     arrowParens: "avoid",
     printWidth: 800,
     trailingComma: "none",
   }
   ```

7. [命令规范](/naming-convention)
