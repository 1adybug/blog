---
slug: clear-powershell-history
title: 清除 Powershell 历史记录
authors: [1adybug]
date: 2024-04-07
tags: [powershell]
---

- 历史记录保存位置，直接删除不想要的行即可

    ```powershell
    echo (Get-PSReadlineOption).HistorySavePath
    ```

- 或者直接删除文件

    ```powershell
    Remove-Item (Get-PSReadlineOption).HistorySavePath
    ```

需要重启终端才能生效
