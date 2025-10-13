---
slug: add-global-rules-to-clash
title: 在 Clash 中添加全局规则
authors: [1adybug]
date: 2024-10-14
tags: [clash]
---

有时候我们希望某些网站不走代理，这时候就需要添加自定义规则，右击订阅，选择扩展脚本：

```javascript
// Define main function (script entry)

/**
 * @param {object} config
 * @param {string[]} config.rules
 * @param {string} profileName
 */
function main(config, profileName) {
    config.rules.unshift("DOMAIN-SUFFIX,axshare.com,DIRECT")
    config.rules.unshift("DOMAIN-SUFFIX,bing.com,DIRECT")
    config.rules.unshift("DOMAIN-SUFFIX,codesandbox.io,DIRECT")
    config.rules.unshift("DOMAIN-SUFFIX,csbops.io,DIRECT")
    config.rules.unshift("DOMAIN-SUFFIX,csb.app,DIRECT")
    config.rules.unshift("DOMAIN-SUFFIX,gallerycdn.vsassets.io,节点选择")
    config.rules.unshift("DOMAIN-SUFFIX,gallery.vsassets.io,节点选择")
    config.rules.unshift("DOMAIN-SUFFIX,marketplace.visualstudio.com,节点选择")
    return config
}
```

`DOMAIN` 是指定域名，`DOMAIN-SUFFIX` 是指定域名后缀，`DIRECT` 和 `节点选择` 都是规则内的分组。

| 规则类型 | 匹配逻辑 | 匹配目标 | 性能等级 | 关键注意事项 |
| :--- | :--- | :--- | :--- | :--- |
| `DOMAIN` | 精确域名匹配 | 域名 | 低 | 仅匹配完全相同的域名字符串。 |
| `DOMAIN-SUFFIX` | 域名后缀匹配 | 域名 | 低 | 匹配指定后缀及其所有子域名。 |
| `DOMAIN-KEYWORD` | 域名关键词匹配 | 域名 | 中 | 匹配域名中任何位置出现的关键词，可能产生误匹配。 |
| `IP-CIDR` | 目标 IPv4 地址段 | 目标 IPv4 | 高 | 默认触发 DNS 解析。 |
| `IP-CIDR6` | 目标 IPv6 地址段 | 目标 IPv6 | 高 | 默认触发 DNS 解析。 |
| `GEOIP` | 目标 IP 地理位置 | 目标 IP | 高 | 基于 MaxMind 数据库；默认触发 DNS 解析。 |
| `SRC-IP-CIDR` | 源 IPv4 地址段 | 源 IPv4 | 低 | 主要用于网关模式，区分局域网内不同设备。 |
| `DST-PORT` | 目标端口 | 目标端口 | 低 | 基于 TCP/UDP 目标端口进行匹配。 |
| `SRC-PORT` | 源端口 | 源端口 | 低 | 基于 TCP/UDP 源端口进行匹配。 |
| `PROCESS-NAME` | 进程名称 | 进程名 | 中 | 操作系统相关；适用于 Windows, macOS, Linux, FreeBSD。 |
| `PROCESS-PATH` | 进程路径 | 进程路径 | 中 | 操作系统相关；比进程名更精确，但可移植性差。 |
| `IPSET` | Linux IP 集 | 目标 IP | 低 (内核) | 仅 Linux 可用；需要 ipset 工具；性能极高。 |

有时候我们希望某些规则对于所有的订阅都生效，这时候我们可以右击 `全局扩展脚本`，选择编辑文件：

```javascript
// Define main function (script entry)

/**
 * @param {object} config
 * @param {string[]} config.rules
 * @param {string} profileName
 */
function main(config, profileName) {
    /** @type string | undefined */
    const name = config["proxy-groups"]?.at(0)?.name
    config.rules.unshift(`DOMAIN-SUFFIX,neo4j.com,${name}`)
    return config
}
```

这里的意思找到订阅的第一个分组（一般都是通用的代理规则），然后将这条规则添加到这个分组中。

如果需要对于脚本进行调试，可以添加 `console.log`，在保存脚本以后，会在 `全局扩展脚本` 下方出现一个日志按钮，点击以后会输出脚本的日志。
