---
slug: differece-among-ZonedDateTime-CalendarDate-CalendarDateTime-Time
title: "@internationalized/date 中的 ZonedDateTime、CalendarDate、CalendarDateTime、Time 几种时间类型的区别"
authors: [Gemini, 1adybug]
date: 2025-07-25
tags: [gemini, heroui]
---

_以下内容均为 `Gemini 2.5 Pro` 生成_

## @internationalized/date：深入解析四种核心时间类型

在 JavaScript 中处理日期和时间常常因为时区、日历系统和国际化等问题而变得复杂。`@internationalized/date` 库提供了一套强大且设计精良的工具来应对这些挑战。该库的核心是其不可变的时间对象：`ZonedDateTime`、`CalendarDate`、`CalendarDateTime` 和 `Time`。理解它们之间的差异对于正确和高效地处理日期与时间至关重要。

以下是这四种时间类型的详细区别：

---

### `CalendarDate`：纯粹的日期

`CalendarDate` 对象表示一个不含任何时间信息的特定日期。它非常适合用来表示与一天中的具体时间无关的事件，例如：

- 生日
- 节假日
- 全天日历事件

**核心特性：**

- **仅包含日期部分：** 年、月、日。
- **无时间概念：** 不涉及小时、分钟或秒。
- **无时区信息：** 它代表的是一个日历上的日期，与任何特定时区无关。
- **支持多种日历系统：** 可以表示公历（Gregorian）以及希伯来（Hebrew）、伊斯兰（Islamic）等多种日历。

**示例：**

```javascript
import { CalendarDate } from "@internationalized/date"

// 表示 2025 年 7 月 24 日
const birthday = new CalendarDate(2025, 7, 24)

console.log(birthday.toString()) // 输出: 2025-07-24
```

---

### `Time`：纯粹的时间

与 `CalendarDate` 相对，`Time` 对象表示一个不含任何日期信息的特定时间。它适用于表示与具体哪一天无关的时间点，例如：

- 每天的闹钟时间
- 商店的营业时间

**核心特性：**

- **仅包含时间部分：** 小时、分钟、秒和毫秒。
- **无日期概念：** 不涉及年、月、日。
- **无时区信息：** 它代表的是时钟上的一个时间，与任何特定时区无关。

**示例：**

```javascript
import { Time } from "@internationalized/date"

// 表示上午 9 点 30 分
const openingHour = new Time(9, 30)

console.log(openingHour.toString()) // 输出: 09:30:00
```

---

### `CalendarDateTime`：日期与时间的结合

`CalendarDateTime` 对象是 `CalendarDate` 和 `Time` 的结合体，它表示一个具体的日期和时间，但 **不包含任何时区信息**。这在表示一个特定时间点，但该时间点在不同时区下可能对应不同实际时刻的场景中非常有用。

**核心特性：**

- **包含日期和时间部分：** 年、月、日、小时、分钟、秒。
- **无时区信息：** 它是一个“本地”的日期时间，其确切的时间点取决于观察者所在的时区。
- **支持多种日历系统。**

**示例：**

```javascript
import { CalendarDateTime } from "@internationalized/date"

// 表示 2025 年 10 月 26 日上午 10 点
const localEvent = new CalendarDateTime(2025, 10, 26, 10)

console.log(localEvent.toString()) // 输出: 2025-10-26T10:00:00
```

这个时间可以被理解为“任何时区的上午10点”。

---

### `ZonedDateTime`：完整的、带时区的日期时间

`ZonedDateTime` 是这四种类型中信息最全面的对象。它表示一个在 **特定时区** 下的精确日期和时间。这是处理需要明确、无歧义时间点的最佳选择，例如：

- 航班起飞时间
- 国际会议的安排
- 任何需要考虑夏令时和时区转换的场景

**核心特性：**

- **包含日期和时间部分。**
- **包含明确的时区信息：** 它与一个IANA时区标识符（如 "America/New_York"）相关联。
- **准确无歧义：** 它代表了地球上的一个精确时刻。
- **自动处理夏令时：** 库会根据指定的时区正确处理夏令时的变化。
- **支持多种日历系统。**

**示例：**

```javascript
import { getLocalTimeZone, ZonedDateTime } from "@internationalized/date"

// 表示在纽约时区 2025 年 11 月 5 日下午 8 点
const flightDeparture = new ZonedDateTime(
    2025,
    11,
    5,
    "America/New_York",
    20, // 20 点
    0,
)

console.log(flightDeparture.toString()) // 输出类似: 2025-11-05T20:00:00-05:00[America/New_York]

// 获取用户本地时区的当前时间
const nowInLocal = new ZonedDateTime(new Date(), getLocalTimeZone())
```

### 总结与选择指南

| 类型                   | 包含日期 | 包含时间 | 包含时区 | 适用场景                                   |
| :--------------------- | :------: | :------: | :------: | :----------------------------------------- |
| **`CalendarDate`**     |    ✅    |    ❌    |    ❌    | 生日、全天事件、不关心具体时间的日期       |
| **`Time`**             |    ❌    |    ✅    |    ❌    | 每日重复的闹钟、营业时间                   |
| **`CalendarDateTime`** |    ✅    |    ✅    |    ❌    | 本地化的日历事件，时间点相对于观察者时区   |
| **`ZonedDateTime`**    |    ✅    |    ✅    |    ✅    | 航班时刻、国际会议、任何需要精确时刻的场景 |

通过理解这四种类型的不同职责，开发者可以更加精确和可靠地在应用程序中处理各种复杂的日期和时间逻辑，避免由时区和日历系统带来的常见错误。
