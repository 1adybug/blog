---
slug: bug-with-excel-date
title: Excel 日期处理中的一个 bug
authors: [1adybug]
date: 2025-01-08
tags: [excel, sheetjs, date, dayjs]
---

最近在使用 `SheetJS` 的 `xlsx` 库（以下用 `SheetJS` 代称）处理 `Excel` 的数据时，遇到一个非常有趣的 bug。

在读取 `xlsx` 文件时，我并没有设置读取的配置，所有读取出来的数据都是 `Record<string, string>` 类型。在处理日期数据时，我发现返回的数据是一个整数字符串，例如 `44297`，而不是我期望的日期字符串，例如 `2024-12-30`。询问 `Claude` 得到以下回答：

---

让我解释一下 `Excel` 中日期的存储机制。

`Excel` 将日期存储为序列号（serial number），这是从一个特定的起始日期开始计算的天数。具体来说：

1. 对于 `Windows` 版本的 `Excel`，起始日期是 1900 年 1 月 1 日，这一天的序列号是 1
2. 对于 Mac 版本的 `Excel`，起始日期是 1904 年 1 月 1 日，这一天的序列号是 0

你看到的 `45293` 就是这样的序列号。让我用代码演示一下如何处理这个数字：

从上面的演示可以看出，序列号 `45293` 对应的是 2024 年 1 月 2 日。这种存储方式有几个特点：

1. 整数部分表示天数
2. 小数部分表示时间（例如 `45293.5` 表示当天的中午 12 点）
3. 这种格式便于进行日期计算，比如两个日期相减就能得到相差的天数

当你在编程中处理 `Excel` 文件时，可以使用像 `SheetJS` 这样的库来正确解析这些数值。如果你在用 `Python`，`pandas` 库也能自动处理这种转换。如果需要，我可以给你展示更多的日期处理示例。

---

真是坑爹，`Windows` 和 `Mac` 版本的 `Excel` 竟然表现还不一致，不过手头没有 `Mac`，就无法测试差异了。

了解了原理，就尝试自己处理这个问题。我使用了 `dayjs` 库来处理日期，代码如下：

```typescript
import dayjs from "dayjs"

import "dayjs/locale/zh-cn"

dayjs.locale("zh-cn")

const start = dayjs("1900-01-01 00:00:00")

function parser(serial: number) {
    return start.add(serial - 1, "day").format("YYYY-MM-DD HH:mm:ss")
}

console.log(parser(45293))
```

得到的结果是 `2024-01-03 00:00:00`

可以看到时间是正确的，但是日期是错误的，我想是不是时区转换引起的。尝试使用 `UTC` 时间来实现 `start`：

```typescript
// ...
const start = dayjs("1900-01-01T00:00:00.000Z")
// ...
```

:::warning

注意，`dayjs` 会默认进行本地化

:::

我擦，问题又出现了，得到的结果是 `2024-01-03 00:05:43`！我可以理解，小时是由于时区的差异产生的错误，但是分钟和秒怎么会有偏差呢？那肯定是某个时间点出问题了：

```typescript
console.log(new Date("1900-01-01T00:00:00.000Z").toString())
```

得到的结果是 `Mon Jan 01 1900 08:05:43 GMT+0805 (中国标准时间)`！再次询问 `Claude`，得到以下回答：

---

让我解释这个有趣的现象。这涉及到历史上的时区变迁和JavaScript处理日期的方式。
原因主要有两点：

1900年时的中国采用的是地方时间（Local Mean Time, LMT），而不是现在的 UTC+8 时区。具体来说，当时北京使用的是 UTC+8:05:43。
`JavaScript` 的 `new Date()` 在处理历史日期时会考虑历史时区信息。当你创建一个 1900 年的日期时，`JavaScript` 会使用当时的历史时区偏移，而不是现代的 UTC+8。

---

OK，那我们采用另一种策略来处理这个问题：我们把 `Excel` 中的时间就当做是 `UTC` 时间，然后在处理时加上 `8` 小时：

```typescript
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

const start = dayjs.utc("1900-01-01 00:00:00.00")

function parser(serial: number) {
    return start.add(serial - 1, "day").format("YYYY-MM-DD HH:mm:ss")
}

console.log(parser(45293))
```

得到的结果是 `2024-01-03 00:00:00`，问题解决！日期仍然错误，继续询问 `Claude`：

---

让我帮你分析一下这个差异。我会用 `SheetJS` 来测试。

啊！现在我明白为什么会有这个差异了。这是因为 `Excel` 和 `SheetJS` 在处理日期时有一个历史遗留问题：

1. `Excel` 有一个著名的 1900 年闰年 bug：`Excel` 错误地认为 1900 年是闰年，在 1900 年 2 月 28 日之后多算了一天。

2. 所以对于 2024/1/2 这个日期：
    - 不考虑 bug 时的序列号是：45292（这是实际天数）
    - 考虑 bug 后的序列号是：45293（这是 `SheetJS` 和 `Excel` 实际使用的数字）

所以如果你使用 `SheetJS` 读取到的是 45293，这是完全正确的。让我给你一个正确处理这个序列号的代码：

```typescript
function parser(serial: number) {
    // 修正 1900 年闰年 bug：如果序列号大于 60，需要减 1
    const adjustedSerial = serial > 60 ? serial - 1 : serial

    const epoch = new Date("1900-01-01T00:00:00+08:00")
    const millisecondsPerDay = 24 * 60 * 60 * 1000

    return new Date(epoch.getTime() + (adjustedSerial - 1) * millisecondsPerDay)
}

// 使用示例
const serial = 45293 // `SheetJS` 读取的值
const date = parser(serial)
// 将输出 2024/1/2
```

总结一下：

1. 你获取到 45293 是正确的，这是 `SheetJS` 和 `Excel` 实际使用的序列号
2. 这个数字比实际天数大 1，是因为 `Excel` 的 1900 年闰年 bug
3. 在处理这类日期时，建议：
    - 如果你使用 `SheetJS` 的内置函数（如 `XLSX.SSF.parse_date_code`），直接使用 45293
    - 如果你自己写转换逻辑，记得处理这个 +1 的差异

这就是为什么我们会看到这个差异。这是 `Excel` 中一个著名的特性，为了保持兼容性，现代的库（包括 `SheetJS`）都会遵循这个行为。

---

算了，我还是用 `SheetJS` 的内置函数来处理这个问题吧，这样就不用自己处理这个 `+1` 了。

```typescript
import xlsx from "xlsx"

const date = xlsx.SSF.parse_date_code(45293)
console.log(date)
```

这里又有一个坑，`SheetJS` 中的 `SSF` 类型是 `any`，但是它引用是 `ssf` 这个库，所以我们需要安装这个库：

```typescript
import ssf from "ssf"

type SSFDate = {
    D: number /* number of whole days since relevant epoch, 0 <= D */
    y: number /* integral year portion, epoch_year <= y */
    m: number /* integral month portion, 1 <= m <= 12 */
    d: number /* integral day portion, subject to gregorian YMD constraints */
    q: number /* integral day of week (0=Sunday .. 6=Saturday) 0 <= q <= 6 */

    T: number /* number of seconds since midnight, 0 <= T < 86400 */
    H: number /* integral number of hours since midnight, 0 <= H < 24 */
    M: number /* integral number of minutes since the last hour, 0 <= M < 60 */
    S: number /* integral number of seconds since the last minute, 0 <= S < 60 */
    u: number /* sub-second part of time, 0 <= u < 1 */
}

const date = ssf.parse_date_code(45293)
console.log(date)
```

```json
{
    "D": 45293,
    "y": 2024,
    "m": 1,
    "d": 2,
    "q": 2,
    "T": 0,
    "H": 0,
    "M": 0,
    "S": 0,
    "u": 0
}
```
