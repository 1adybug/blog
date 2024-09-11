---
slug: problems-with-react-native-and-expo
title: React Native 和 Expo 开发中的问题汇总
authors: [1adybug]
date: 2024-09-05
tags: [react, react native, expo]
---

## 无法连接到开发服务器

:::warning

could not connect to the development server

:::

解决方案：

1. 在虚拟机中连接 WiFi
2. 在 Android Studio 中将 `Gradle` 的 `Java` 位置设置为系统位置

## 项目编译失败

解决方案：

在 Android Studio 中打开 android 目录

## 动画暂停之后速度变慢

原因：

动画暂停之后再开始，会以设置的全部时间来完成剩余的进度

解决方案：

```TypeScript
/** 初始值 */
const fromValue = 0

/** 重点值 */
const toValue = 100

/** 时间 */
const duration = 10000

/** 速度 */
const speed = (toValue - fromValue) / duration

/** 动画值 */
const translateX = useRef(new Animated.Value(fromValue)).current

/** 暂停值 */
const stopValue = useRef(fromValue)

/** 动画状态 */
const status = useRef(false)

function onClick() {
    // 如果暂停值已经达到目标值，说明动画已经完成
    if (stopValue.current === toValue) return
    // 如果动画处于播放状态，暂停动画，并且将当前值赋予给暂停值
    if (status.current) translateX.stopAnimation(value => (stopValue.current = value))
    // 否则播放动画
    else Animated.timing(translateX, {
        toValue,
        duration: (toValue - stopValue.current) / speed,
        useNativeDriver: true,
        easing: Easing.linear
    }).start(({ finished }) => finished && (stopValue.current = toValue))
    status.current = !status.current
}
```
