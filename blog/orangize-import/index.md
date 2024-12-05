---
slug: orangize-import
title: 调整导入顺序
authors: [1adybug]
date: 2024-12-04
tags: [prettier, import]
---

1. 安装插件

    ```bash
    bun i @ianvs/prettier-plugin-sort-imports glob -D
    ```

2. 写入配置文件 `prettier.config.mjs`：

    ```javascript
    // @ts-check

    import { parse } from "path"
    import { globSync } from "glob"

    const jsExts = [".js", ".jsx", ".ts", ".tsx", ".cjs", ".mjs", ".cts", ".mts", ".vue"]

    const assetExts = Array.from(
        new Set(
            globSync("**/*", { ignore: ["node_modules/**"], withFileTypes: true })
                .filter(path => path.isFile() && !jsExts.some(ext => path.name.toLowerCase().endsWith(ext)))
                .map(path => parse(path.name).ext.slice(1))
                .filter(ext => ext !== ""),
        ),
    )

    const assetExtsRegStr = `\\.(${assetExts.join("|")}|${assetExts.join("|").toUpperCase()})`

    const assetQueryRegStr = "(\\?[a-zA-Z0-9]+)?"

    /**
     * @type {import("prettier").Options}
     */
    const config = {
        semi: false,
        tabWidth: 4,
        arrowParens: "avoid",
        printWidth: 160,
        plugins: ["@ianvs/prettier-plugin-sort-imports"],
        importOrder: [
            "<BUILTIN_MODULES>",
            "<THIRD_PARTY_MODULES>",
            "",
            `^@.+?(?<!${assetExtsRegStr}${assetQueryRegStr})$`,
            `^\\.{1,2}/.+?(?<!${assetExtsRegStr}${assetQueryRegStr})$`,
            "",
            `^@.+?${assetExtsRegStr}${assetQueryRegStr}$`,
            `^\\.{1,2}/.+?${assetExtsRegStr}${assetQueryRegStr}$`,
        ],
        importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
        importOrderTypeScriptVersion: "5.0.0",
        importOrderCaseSensitive: true,
    }

    export default config
    ```

3. 配置 `package.json`：

    ```json
    {
        "scripts": {
            "lint": "prettier --write ."
        }
    }
    ```

4. 运行 `npm run lint` 即可调整导入顺序。
