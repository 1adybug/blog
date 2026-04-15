---
slug: bypassing-clash-verge-proxy-for-selected-applications
title: 让应用程序绕过 Clash Verge 代理（TUN / 系统代理通用方案）
authors: [1adybug]
date: 2026-04-15
tags: [微信, clash, clash verge]
---

## 背景

在开启 TUN 模式或系统代理模式时，部分应用（如微信、Radmin VPN）可能出现：

- 文件传输缓慢或失败
- 局域网通信异常
- VPN 无法建立连接

本文提供一套**通用方案**，使指定应用绕过 Clash Verge 代理。

---

## 步骤 1：配置 TUN 排除进程

打开「订阅」→「全局扩展覆写配置」，覆盖粘贴：

```yaml
# Profile Enhancement Merge Template for Clash Verge

profile:
  store-selected: true

# ✅ 关键：让 Radmin VPN 不被 TUN 接管
tun:
  exclude-process:
    - AnyDesk.exe
    - WeChatAppEx.exe
    - WeixinUpdate.exe
    - Weixin.exe
    - WetypeInstaller.exe
    - WeixinExt.exe
    - RvRvpnGui.exe
    - RvControlSvc.exe
    - Radmin.exe
    - drvinst.exe
    - RvFwHelper.exe
    - RvGuiStarter.exe
```

👉 作用：这些进程不会被 TUN 模式接管

---

## 步骤 2：添加规则强制直连

打开「全局扩展脚本」，覆盖粘贴：

```js
// Define main function (script entry)

function main(config, profileName) {
    // 为所有代理节点添加或设置 'udp: true'
    if (config.proxies) config.proxies.forEach(proxy => (proxy.udp = true))

    config.rules ??= []

    // 保留原有的添加域名规则的逻辑
    const name = config["proxy-groups"]?.at(0)?.name

    const excludeProcesses = [
        "AnyDesk.exe",
        "WeChatAppEx.exe",
        "WeixinUpdate.exe",
        "Weixin.exe",
        "WetypeInstaller.exe",
        "WeixinExt.exe",
        "RvRvpnGui.exe",
        "RvControlSvc.exe",
        "Radmin.exe",
        "drvinst.exe",
        "RvFwHelper.exe",
        "RvGuiStarter.exe",
    ]

    if (name) {
        config.rules.unshift(`DOMAIN-SUFFIX,claude.ai,${name}`)
        config.rules.unshift(`DOMAIN-SUFFIX,claude.com,${name}`)
        config.rules.unshift(`IP-CIDR,26.0.0.0/8,DIRECT`)
        excludeProcesses.forEach(item => (config.rules.unshift(`PROCESS-NAME,${item},DIRECT`)))
    }

    return config
}
```

👉 作用：

- 强制指定进程走直连
- 即使切换到“代理模式”仍然生效

---

## 步骤 3（可选）：调整 DNS 模式

打开「设置」→「DNS 覆写」，将：

- `fake-ip` → `redir-host`

👉 适用于以下情况：

- 微信传文件异常
- 局域网通信不稳定

⚠️ 注意：

- 此步骤为可选项
- 如果修改后出现网络异常，可以恢复为 `fake-ip`

---

## 验证是否生效

可以通过以下方式确认：

### 1. 测试 Radmin VPN

```bash
ping 26.x.x.x
```

应正常通信。

---

### 2. 查看 Clash 日志

在日志中应看到：

```
26.x.x.x → DIRECT
```

---

## 原理说明

本方案基于三点：

1. `tun.exclude-process`
    - 控制流量是否进入 Clash（入口）

2. `PROCESS-NAME,...,DIRECT`
    - 控制流量走直连（出口）

3. `IP-CIDR,26.0.0.0/8,DIRECT`
    - 确保 Radmin VPN 内网流量不被代理

---

## 总结

- TUN 排除：避免应用被接管
- 规则直连：保证任何模式下都不走代理
- DNS 调整：作为兼容性优化手段

通过以上配置，可以实现 Clash Verge 与微信、Radmin VPN 等应用的稳定共存。
