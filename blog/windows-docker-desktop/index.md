---
slug: windows-docker-desktop
title: windows 版本的 docker desktop
authors: [1adybug]
date: 2025-02-17
tags: [windows, docker, wsl]
---

之前为了便于 `wsl` 中的系统直接使用 `windows` 的代理，我将 `wsl` 的网络模式都设置为了 `mirrored`，这样就导致了无法使用 ip 访问 `docker` 中的应用，所以必须将网络模式设置为 `NAT`，这样就可以通过 ip 访问 `docker` 中的应用了。

```wslconfig
[wsl2]
# 注释掉或者改为 NAT
# networkingMode=mirrored
networkingMode=NAT
```

关闭 `wsl`，然后重启 `docker desktop`，这样就可以通过 ip 访问 `docker` 中的应用了。

```shell
wsl --shutdown
```
