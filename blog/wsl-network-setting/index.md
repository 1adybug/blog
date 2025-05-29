---
slug: wsl-network-setting
title: WSL 网络设置
authors: [1adybug]
date: 2024-12-25
tags: [wsl, clash, proxy]
---

`wsl` 默认使用的是 `NAT` 模式的网络，无法直接访问外部网络，可以通过修改 `wsl` 的网络设置，将其设置为 `mirrored`，使其能够直接访问外部网络。

在 `C:\Users\用户名` 目录下创建 `.wslconfig` 文件，内容如下：

```wslconfig
[wsl2]
networkingMode=mirrored
```

在 `wsl` 中查看网络配置：

```bash
ifconfig
```

如果 ip 地址已经和主机在同一个网段，那么网络设置已经生效。

重启 `wsl` 使设置生效：

```bash
wsl --shutdown
```

代理可能需要重新设置，或者重启代理软件或者主机

如果要在 `NAT` 模式下使用 `clash` 代理，可以参考 [获取 Windows 在 wsl 中的 ip](get-windows-ip-in-wsl) 这篇文章

```shell
vi ~/.bashrc
```

在 `~/.bashrc` 文件中添加以下内容：

```shell
export http_proxy=http://172.30.160.1:7890
export https_proxy=http://172.30.160.1:7890
export all_proxy=http://172.30.160.1:7890
export HTTP_PROXY=http://172.30.160.1:7890
export HTTPS_PROXY=http://172.30.160.1:7890
export ALL_PROXY=http://172.30.160.1:7890
```

重启终端，或者执行 `source ~/.bashrc` 使设置生效。
