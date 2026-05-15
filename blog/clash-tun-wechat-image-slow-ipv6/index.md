---
slug: clash-tun-wechat-image-slow-ipv6
title: Clash TUN 模式下微信收发图片变慢：一次 IPv6 排查记录
authors: [1adybug]
date: 2026-05-15
tags: [微信, clash, clash verge]
---

最近我在 Clash Verge / Mihomo 中开启了 TUN 模式后，发现微信收发图片明显变慢。一开始我怀疑是微信图片流量被代理服务器接管了，导致绕路。

但排查日志后发现，真正的问题并不是“微信走了代理”，而是 Clash 中开启 IPv6 后，让微信尝试了一条当前网络环境不可达的 IPv6 路径。

## 现象

开启 Clash TUN 模式后：

- 微信文字消息基本正常
- 接收和发送图片明显变慢
- 关闭 Clash 中的 IPv6 后，微信图片恢复正常

## 排查过程

先查看 Clash / Mihomo 的规则和连接日志。

配置中微信相关进程已经被明确设置为直连：

```yaml
- PROCESS-NAME,Weixin.exe,DIRECT
- PROCESS-NAME,WeixinUpdate.exe,DIRECT
- PROCESS-NAME,WeChatAppEx.exe,DIRECT
- PROCESS-NAME,WeixinExt.exe,DIRECT
```

随后在微信接收一张图片时，对比 Mihomo 日志，发现新增记录类似这样：

```text
[TCP] dial DIRECT (match ProcessName/Weixin.exe)
Weixin.exe --> [240e:xxxx:xxxx::xxxx]:443
error: connect failed: dial tcp [240e:xxxx:xxxx::xxxx]:443:
A socket operation was attempted to an unreachable network.
```

关键信息有三个：

```text
DIRECT
ProcessName/Weixin.exe
IPv6 unreachable network
```

也就是说，微信并没有走代理，而是命中了 `DIRECT` 规则。但它尝试访问腾讯/微信的 IPv6 地址时，当前网络环境下这条 IPv6 路径不可达，于是发生反复重试，最终造成图片收发很慢。

## 真正原因

问题不是：

- 微信图片走了代理
- 代理服务器太慢
- 微信服务器慢

更准确的原因是：

> Clash / Mihomo 中开启 IPv6 后，微信拿到了 IPv6 目标地址，并尝试直连；但当前 TUN / 网络环境无法真正访问这些 IPv6 地址，于是连接失败、重试、回落，造成明显延迟。

这是一种“看起来支持 IPv6，但实际路径不可达”的情况。

## 解决方式

在 Clash / Mihomo 中关闭 IPv6：

```yaml
ipv6: false

dns:
  ipv6: false
```

然后重启 Clash 内核。

注意，这里说的是关闭 Clash / Mihomo 内部的 IPv6 支持，不是去 Windows 网卡里全局禁用 IPv6。

## 关闭 Clash IPv6 会有什么影响？

关闭后，Clash 通常不再处理 IPv6 目标地址，也不会主动返回 IPv6 DNS 结果。大多数应用会回落到 IPv4。

影响一般是：

- IPv4 代理规则仍然正常工作
- 大多数网站和 App 不受影响
- 少数 IPv6-only 服务可能无法访问
- 如果某些服务 IPv6 路径原本更优，可能失去这部分优势
- 但在当前网络 IPv6 不通的情况下，关闭反而更稳定

## 代理本身是否支持 IPv6？

不能只看代理节点入口 IP 来判断。

即使代理服务器入口是 IPv4，比如：

```text
104.xxx.xxx.xxx:4431
```

它也可能支持代理 IPv6 目标地址。是否支持取决于：

- 节点服务器是否有 IPv6 出站能力
- 代理协议和服务端配置是否支持
- Clash/Mihomo 是否开启 IPv6 处理

在这次问题里，微信本身命中的是 `DIRECT`，所以重点并不是“节点是否支持 IPv6”，而是“微信直连 IPv6 不可达”。

## 总结

这次微信图片慢的核心链路是：

```text
Clash 开启 IPv6
        ↓
微信拿到 IPv6 地址
        ↓
微信按规则 DIRECT 直连
        ↓
当前网络/TUN 环境 IPv6 不可达
        ↓
连接失败、重试、回落
        ↓
收发图片变慢
```

关闭 Clash 中的 IPv6 后，微信更早走 IPv4，绕过不可达的 IPv6 路径，问题解决。

如果你也遇到 Clash TUN 模式下微信、QQ、国内 App 图片或资源加载很慢，可以优先检查 Mihomo 日志中是否存在类似：

```text
DIRECT
IPv6
unreachable network
```

如果有，那么关闭 Clash / Mihomo 的 IPv6 很可能就是最直接的解决办法。
