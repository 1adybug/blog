---
slug: snippets-keyword-replace
title: 代码片段关键字替换
authors: [1adybug]
date: 2025-05-15
tags: [snippets, keyword-replace]
---

有的时候我们需要在代码片段同时进行两种替换，比如下方，我们要将 `api` 移除，并将其转换为驼峰式命名法：

| 烤肉串式命名法 (Kebab-case) | 驼峰式命名法 (CamelCase) |
| --------------------------- | ------------------------ |
| `api.my-file`               | `myFile`                 |
| `api.another-example-file`  | `anotherExampleFile`     |
| `api.yet-another-one`       | `yetAnotherOne`          |

这种替换的难点在我们无法确定 `-` 的数量为多少

这时候可以使用以下代码实现：

```typescript
const prefix = "api\\\\.([^-]+)"

const unit = "-([^-])([^-]*)"

const max = 6

const regExp = Array(max)
    .fill(prefix)
    .map((item, index) => ["^", item, ...Array(index).fill(unit), "$"].join(""))
    .join("|")

const replacer = Array(max)
    .fill(0)
    .reduce(
        (acc, item, index) => [
            ...acc,
            [
                (acc.at(-1)?.at(-1) ?? 0) + 1,
                ...Array(index * 2)
                    .fill(0)
                    .map(
                        (item2, index2) =>
                            (acc.at(-1)?.at(-1) ?? 0) + 1 + index2 + 1,
                    ),
            ],
        ],
        [],
    )
    .map(item =>
        item
            .map((item2, index2) =>
                index2 % 2 === 0 ? `$${item2}` : `$\{${item2}:/upcase}`)
            .join(""))
    .join("")

const body = `\${TM_FILENAME_BASE/${regExp}/${replacer}/}`

console.log(body)
```

想要最大支持多少个 `-` ，只需要修改 `max` 的值即可。
