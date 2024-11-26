---
slug: add-open-in-terminal-to-right-meun
title: 在右键菜单中添加“在终端中打开”
authors: [1adybug]
date: 2024-11-26
tags: [windows terminal]
---

## 添加

新建文本文档，将以下内容复制到文本文档中：

```reg
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\Background\shell\wt]
@="在此处打开 Windows Terminal"
"Icon"="C:\Users\lenovo\Pictures\terminal.ico"

[HKEY_CLASSES_ROOT\Directory\Background\shell\wt\command]
@="wt.exe -d \"%V\""

[HKEY_CLASSES_ROOT\Directory\shell\wt]
@="在此处打开 Windows Terminal"
"Icon"="C:\Users\lenovo\Pictures\terminal.ico"

[HKEY_CLASSES_ROOT\Directory\shell\wt\command]
@="wt.exe -d \"%V\""
```

将 `C:\Users\lenovo\Pictures\terminal.ico` 替换为你的 `Windows Terminal` 程序或者 `.ico` 文件图标路径。

:::warning

由于 `Windows Terminal` 经常会升级，所以如果使用 `Windows Terminal` 的绝对路径作为图标，可能会导致图标失效。

:::

**使用 `UTF-16 LE` 编码格式保存文件，将文件后缀名改为 `.reg`，双击运行即可**。

## 删除

新建文本文档，将以下内容复制到文本文档中：

```reg
Windows Registry Editor Version 5.00

[-HKEY_CLASSES_ROOT\Directory\Background\shell\wt]
[-HKEY_CLASSES_ROOT\Directory\shell\wt]
```

**同样使用 `UTF-16 LE` 编码格式保存文件，将文件后缀名改为 `.reg`，双击运行即可**。
