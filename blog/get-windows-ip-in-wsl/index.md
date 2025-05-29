---
slug: get-windows-ip-in-wsl
title: 获取 windows 在 wsl 中的 ip
authors: [1adybug]
date: 2024-08-02
tags: [windows, linux, wsl]
---

有时我们需要在 `wsl` 中与 `windows` 进行通信，比如设置代理之类，可以通过以下方式获取到 `windows` 的 ip：

在终端中输入：

```shell
ipconfig
```

带有 `vEthernet (WSL (Hyper-V firewall))` 字段的适配器便是 `wsl` 所在的网络，ip 地址便是 `windows` 的 ip。

当然，有时候我可能会发现在 `wsl` 中无法访问到 `windows` 的服务，大概率是防火墙的问题，可以尝试关闭防火墙，或者新增一个入站规则，允许 `wsl` 访问 `windows` 的端口。

1. 打开 `Windows Defender`
2. 点击 `防火墙和网络保护`
3. 点击 `高级设置`
4. 点击 `入站规则`
5. 点击 `新建规则`
6. 选择 `端口`
7. 选择 `特定本地端口`
8. 输入 `windows` 的 ip 和端口
9. 点击 `确定`

这样就可以在 `wsl` 中访问到 `windows` 的 ip 了。
