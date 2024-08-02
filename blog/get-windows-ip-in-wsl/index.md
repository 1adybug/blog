---
slug: get-windows-ip-in-wsl
title: 获取 windows 在 wsl 中的 ip
authors: [1adybug]
date: 2024-08-02
tags: [windows, linux, wsl]
---

有时我们需要在 wsl 中与 windows 进行通信，比如设置代理之类，可以通过以下方式获取到 windows 的 ip：

在终端中输入：

```shell
ipconfig
```

带有 `vEthernet (WSL (Hyper-V firewall))` 字段的适配器便是 `wsl` 所在的网络，ip 地址便是 windows 的 ip。
