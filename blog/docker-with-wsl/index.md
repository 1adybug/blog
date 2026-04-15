---
slug: docker-with-wsl
title: 使用 wsl 版的 docker desktop
authors: [1adybug]
date: 2025-02-19
tags: [wsl, docker]
---

如果在内网安装 `docker desktop`，那么 `docker desktop` 会强制要求升级 `wsl`，否则无法使用。只需要修改 `docker desktop` 的配置文件：

```json
// C:\Users\用户名\AppData\Roaming\Docker\setting-store.json
{
    // 添加这一行
    "WslUpdateRequired": false
}
```
