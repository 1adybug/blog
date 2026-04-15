---
slug: troubleshooting-clash-tun-mode
title: Clash TUN 模式的兔子洞：一次从 DNS 到 UDP 的排错之旅
authors: [1adybug]
date: 2025-10-21
tags: [Gemini]
---

> 以下内容均为 `Gemini 2.5 Pro Deep Research` 生成

如果你是一位 Clash 的进阶用户，你很可能遇到过这个经典难题：一套精心编写、在"规则模式"（系统代理）下完美运行的规则，在切换到功能强大的"TUN 模式"后却突然失效。本该走向代理的流量莫名其妙地选择了直连,让你只能盯着连接日志，对自己的配置产生怀疑。

这正是一次此类排错之旅的真实记录——一个多层次的问题，它始于 DNS，意外地转向了网络协议，最终以一个优雅的脚本方案画上句号。跟随本文，你将理解其背后深层的运行机制，并学会如何彻底征服 TUN 模式。

---

## 第一部分：消失的主机名悬案

最初的问题非常明确。一位用户使用全局扩展脚本，在规则列表的顶端插入规则，以确保像 `claude.ai` 和 `claude.com` 这样的域名总是通过特定的代理分组。

**脚本如下：**

```javascript
function main(config, profileName) {
    const name = config['proxy-groups']?.?.name;
    //...
    config.rules.unshift(`DOMAIN-SUFFIX,claude.ai,${name}`);
    config.rules.unshift(`DOMAIN-SUFFIX,claude.com,${name}`);
    //...
    return config;
}
```

在 **规则模式** 下，一切正常。但在 **TUN 模式** 下，访问 Claude 的连接却走向了 `DIRECT`。

**根本原因：架构的鸿沟**

这是关于 TUN 模式的第一个，也是最基础的教训：它在网络堆栈的不同层级上工作。

- **规则模式 (系统代理):** 工作在应用层。你的浏览器知道它正在与一个代理服务器对话，并发送一个明确包含主机名（例如 `claude.ai`）的 `HTTP CONNECT` 请求。Clash 直接就拿到了主机名。

- **TUN 模式 (虚拟网卡):** 工作在网络层。它拦截的是原始的 IP 数据包。当一个应用程序发送数据包时，它已经通过 DNS 将 `claude.ai` 解析成了一个真实的 IP 地址。Clash 的 TUN 接口只能看到目标 IP，而看不到原始的主机名。

没有主机名，任何 `DOMAIN-SUFFIX` 规则都形同虚设。

**解决方案：`fake-ip` 登场**

这正是 Clash 的 `fake-ip` DNS 模式要解决的问题。启用后，Clash 会劫持所有的 DNS 请求。它不会返回真实的 IP，而是返回一个本地范围内的"假 IP"（例如 `198.18.0.1/16`），并在内部创建一个映射关系：`假 IP <-> 真实主机名`。

当 TUN 接口看到一个发往该假 IP 的数据包时，它会查询这个映射，恢复原始主机名，从而让基于域名的规则能够正确处理。

**用户的配置失误**

该用户启用了 `fake-ip`，但问题依旧。罪魁祸首隐藏在他的 DNS 设置中：他使用了 `fake-ip-filter-mode: blacklist`（黑名单模式）。这意味着任何匹配 `fake-ip-filter` 列表的域名都**不会**被分配假 IP。他的过滤器很可能包含了一个宽泛的规则集（如 `geosite:cn`），不经意间将 `claude.ai` 也纳入其中，导致它被解析为真实 IP，破坏了后续的规则匹配。

在调整了 DNS 过滤器后，我们取得了进展。连接日志现在可以正确显示主机名了。

问题解决了吗？还没有。流量**仍然**在走 `DIRECT`。

---

## 第二部分：意想不到的 UDP 转折

既然主机名已经正确识别，为什么规则还是不起作用？新的截图在"类型"一栏中给出了关键线索：**`Tun(udp)`**。

**根本原因：QUIC 协议 (HTTP/3)**

这揭示了两种模式之间第二个，也是更微妙的区别。

- 在 **规则模式** 下，浏览器被强制与代理服务器建立一个**基于 TCP** 的 `HTTP CONNECT` 请求。它从不尝试使用其他协议。

- 在 **TUN 模式** 下，浏览器认为它正在直接与互联网对话。为了追求速度，对于任何支持最新协议的服务器（如谷歌、Cloudflare，以及此处的 Claude），它会优先尝试使用现代的 **QUIC 协议（运行于 UDP 之上）**。

问题至此水落石出：用户的代理服务器不支持 UDP 转发。当 Clash 试图将来自 Claude 的 UDP 数据包发送到代理服务器时，操作失败了。这条规则被跳过，流量一路向下，最终落入了配置末尾的 `MATCH` 规则，而该规则很可能被设置为 `DIRECT`。

这完美地解释了为什么规则模式能成功（因为它强制使用 TCP），而 TUN 模式会失败（因为它允许使用 UDP）。

---

## 第三部分：优雅的脚本解决方案

最后一步是在代理节点上启用 UDP 转发。用户的 Trojan 节点配置如下：

```json
{
    "name": "xxxx.com:443",
    "server": "xxxx.com",
    "port": 443,
    "type": "trojan",
    "password": "xxxx",
    "sni": "xxxx.com"
}
```

要启用 UDP，只需增加一行：`"udp": true`。

手动修改配置文件当然可以，但如果订阅更新了怎么办？或者如果有几十个节点呢？这正是 Clash Verge **扩展脚本** 发挥其真正威力的地方。

脚本不仅可以添加规则，还可以在**运行时**修改整个配置对象。用户意识到，他们可以通过在现有脚本中添加一个简单的循环，来一劳永逸地解决这个问题。

**最终的完美脚本：**

```javascript
function main(config, profileName) {
    // 为所有代理节点添加或设置 'udp: true'
    if (config.proxies) config.proxies.forEach(proxy => (proxy.udp = true))

    // 保留原有的添加域名规则的逻辑
    const name = config["proxy-groups"]?.at(0)?.name

    if (name) {
        config.rules.unshift(`DOMAIN-SUFFIX,claude.ai,${name}`)
        config.rules.unshift(`DOMAIN-SUFFIX,claude.com,${name}`)
    }

    return config
}
```

通过这一修改，每当配置文件加载时，脚本都会自动确保每一个代理服务器都启用了 UDP 转发。这是一个健壮的、"一次设置，永久有效"的解决方案。

在应用了这个最终脚本并重启核心后，问题迎刃而解。发往 `claude.ai` 的 `Tun(udp)` 流量现在被正确地路由到了指定的代理。

---

## 关键启示

这次排错之旅为我们掌握 Clash TUN 模式提供了几条至关重要的经验：

1. **DNS 是必要条件：** 要让基于域名的规则在 TUN 模式下生效，正确配置的 `fake-ip` DNS 是强制性的。

2. **小心过滤器：** 密切关注 `fake-ip-filter`。一个配置错误的黑名单可能会成为你域名规则的"无声杀手"。通常，切换到 `whitelist` 模式更安全。

3. **TUN 模式暴露协议差异：** TUN 模式允许应用程序像在开放网络上一样运行，这可能意味着使用 UDP (QUIC)。请为此做好准备。

4. **为你的代理启用 UDP：** 如果你使用 TUN 模式，请确保你的代理节点已设置 `udp: true`。否则，许多现代网络服务都会出现问题。

5. **善用扩展脚本：** 不要只用脚本来添加规则。它们是动态修改整个配置的强大工具，能让你的配置免受订阅更新的影响，并省去手动编辑的麻烦。

通过理解这些层次，你就能从被 TUN 模式困扰，转变为驾驭它的全部力量，获得真正无缝和全面的路由体验。
