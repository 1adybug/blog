---
slug: disable-svgr-classname-prefix
title: 禁用 SVGR 的 classname 前缀
authors: [Gemini, 1adybug]
date: 2025-07-24
tags: [webpack, rsbuild, svgr]
---

_以下内容均为 `Gemini 2.5 Pro` 生成_

## 告别恼人前缀：如何配置 SVGR 不再修改 SVG 的 className

在现代前端开发中，尤其是在 React 项目里，将 SVG 作为组件直接导入是一种优雅且高效的方式。强大的 [SVGR](https://react-svgr.com/) 工具使得这一切变得轻而易举。但你可能很快会发现一个“小惊喜”：你精心命名的 SVG `className` 在转换后，被自动加上了 `文件名_svg__` 这样的前缀。

比如，一个 `className="icon-user"` 可能会变成 `my-icon_svg__icon-user`。

虽然这是 SVGR 出于好意做的保护措施，但在某些场景下，我们确实需要原汁原味的类名。今天，我们就来深入探讨这个问题背后的原因，并提供一个清晰的解决方案。

### 问题背后：为什么 SVGR 要添加前缀？

首先，要明确一点：这不是一个 Bug，而是一个 Feature。

在大型项目中，你可能会从不同的设计师或图标库中引入多个 SVG 文件。这些文件很有可能包含相同的类名，例如 `<svg class="icon">`。如果 SVGR 不做任何处理，直接将它们转换成组件，这些相同的类名就会在全局 CSS 环境中产生**样式冲突**或**样式污染**，导致一个组件的样式意外地影响到另一个。

为了避免这种混乱，SVGR 内部集成的优化工具 **SVGO (SVG Optimizer)** 默认启用了一个名为 `prefixIds` 的插件。这个插件会自动扫描 SVG 内容，并为所有的 `id` 和 `class` 名称添加一个基于文件名的唯一前缀，从而确保其在项目中的唯一性。

### 解决方案：掌控 SVGO 配置

既然知道了问题的根源在于 SVGO 的 `prefixIds` 插件，那么解决方案就很明确了：**覆盖这个插件的默认配置**。

我们可以通过 SVGR 的配置文件，告诉它我们不希望 `prefixIds` 插件来修改我们的 `className`。

#### 推荐方式：使用 `svgr.config.js`

在项目根目录下创建一个独立的配置文件，是管理 SVGR 行为最清晰的方式。

1. **创建文件**：在你的项目根目录（与 `package.json`同级）下创建 `svgr.config.js` 文件。

2. **添加配置**：将以下代码复制到文件中。

    ```javascript
    // svgr.config.js
    module.exports = {
        // 传递给 SVGO 的配置
        svgoConfig: {
            plugins: [
                {
                    // 插件名称，我们要修改的就是这个
                    name: "prefixIds",
                    // 插件参数
                    params: {
                        // 禁用为 ID 添加前缀
                        prefixIds: false,
                        // 禁用为 className 添加前缀 (这是解决问题的关键!)
                        prefixClassNames: false,
                    },
                },
            ],
        },
    }
    ```

    这段配置清晰地告诉 SVGR：“请在运行时，使用我提供的 `svgoConfig`。对于 `prefixIds` 这个插件，请将其 `prefixClassNames` 和 `prefixIds` 参数都设置为 `false`。”

#### 备选方式：在 Webpack 中配置

如果你的项目使用 Webpack 并且已经配置了 `@svgr/webpack`，你也可以直接在 `webpack.config.js` 中完成设置。

```javascript
// webpack.config.js
module.exports = {
    // ... 其他 Webpack 配置
    module: {
        rules: [
            // ... 其他 rules
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "@svgr/webpack",
                        options: {
                            // 在 loader 的 options 中直接传入 svgoConfig
                            svgoConfig: {
                                plugins: [
                                    {
                                        name: "prefixIds",
                                        params: {
                                            prefixIds: false,
                                            prefixClassNames: false,
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    },
}
```

#### 使用 rsbuild 配置

```typescript
import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import { pluginSvgr } from "@rsbuild/plugin-svgr"

export default defineConfig({
    plugins: [
        pluginReact(),
        pluginSvgr({
            svgrOptions: {
                exportType: "default",
                svgoConfig: {
                    plugins: [
                        {
                            name: "prefixIds",
                            params: {
                                prefixIds: false,
                                prefixClassNames: false,
                            },
                        },
                    ],
                },
            },
        }),
    ],
})
```

两种方式效果完全相同，选择哪一种取决于你的项目结构和个人偏好。

### 重要提醒：禁用前缀的潜在风险

当你禁用类名前缀后，避免样式冲突的责任就回到了你的肩上。请确保：

1. **命名规范**：在不同的 SVG 文件中，使用具有唯一性的类名。可以采用 BEM (`block__element--modifier`) 这样的命名约定来降低冲突概率。
2. **CSS 作用域**：使用 CSS Modules, Styled Components, หรือ Tailwind CSS 等技术，它们能从根本上解决全局样式污染的问题。

### 总结

SVGR 默认添加 `className` 前缀是为了防止样式冲突，是一个贴心的设计。但通过简单的配置，我们可以轻松禁用它，以满足特定的开发需求。核心在于通过 `svgoConfig` 选项，将 `prefixIds` 插件的 `prefixClassNames` 参数设置为 `false`。

希望这篇文章能帮助你更好地掌控你的 SVG 工作流，写出更干净、更可控的代码。Happy Coding!
