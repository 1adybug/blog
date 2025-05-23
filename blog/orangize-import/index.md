---
slug: orangize-import
title: 调整导入顺序
authors: [1adybug]
date: 2024-12-04
tags: [prettier, import]
---

1. 安装插件

    ```bash npm2yarn
    npm i @ianvs/prettier-plugin-sort-imports glob -D
    ```

2. 写入配置文件 `prettier.config.mjs`：

    ```javascript
    // @ts-check

    import { readFileSync } from "fs"
    import { parse } from "path"
    import { globSync } from "glob"

    /**
     * 数组去重
     * @template T - 数组的元素类型
     * @param {T[]} array - 输入的数组
     * @return {T[]} 新数组
     */
    function unique(array) {
        return Array.from(new Set(array))
    }

    const jsExts = [".js", ".jsx", ".ts", ".tsx", ".cjs", ".mjs", ".cts", ".mts", ".vue"]

    const assetExts = unique(
        globSync("**/*", { ignore: ["node_modules/**"], withFileTypes: true, cwd: import.meta.dirname })
            .filter(path => path.isFile() && !jsExts.some(ext => path.name.toLowerCase().endsWith(ext)))
            .map(path => parse(path.name).ext.slice(1))
            .filter(ext => ext !== ""),
    )

    const assetExtsRegStr = `\\.(${assetExts.join("|")}|${assetExts.join("|").toUpperCase()})`

    const assetQueryRegStr = "(\\?[a-zA-Z0-9]+)?"

    const namespaces = unique(
        unique(
            globSync("**/package.json", { withFileTypes: true, cwd: import.meta.dirname })
                .filter(path => path.isFile())
                .map(path => path.fullpath()),
        )
            .map(path => JSON.parse(readFileSync(path, "utf8")))
            .map(json =>
                Object.keys({
                    ...json.dependencies,
                    ...json.devDependencies,
                    ...json.peerDependencies,
                    ...json.optionalDependencies,
                }),
            )
            .flat()
            .filter(dep => dep.startsWith("@"))
            .map(dep => dep.split("/")[0].slice(1)),
    )

    /**
     * @type {import("prettier").Options}
     */
    const config = {
        semi: false,
        tabWidth: 4,
        arrowParens: "avoid",
        printWidth: 160,
        plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
        importOrder: [
            "<BUILTIN_MODULES>",
            `^@(${namespaces.join("|")})/`,
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

    :::warning

    `prettier-plugin-tailwindcss` 插件必须放置在 `@ianvs/prettier-plugin-sort-imports` 的后面

    :::

3. 配置 `package.json`：

    ```json
    {
        "scripts": {
            "lint": "prettier --write ."
        }
    }
    ```

4. 运行 `npm run lint` 即可调整导入顺序。
