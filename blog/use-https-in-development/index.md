---
slug: use-https-in-development
title: 在开发环境中使用 https
authors: [1adybug]
date: 2024-04-29
tags: [node, express, openssl, https]
---

现在很多环境下的网络请求要求必须是 https 请求，但是在开发或者内网环境下，无法使用 CA 机构颁发的证书，这时候可以使用 OpenSSL 提供的自签证书功能：

## 安装

在 windows 系统下，可以使用 winget 来安装第三方分发版本：

```powershell
winget search openssl
# 选择一个版本较新的分发版本
winget install FireDaemon.OpenSSL
```

重启终端

## 生成证书

```powershell
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout your-key.pem -out your-cert.pem
```

## 使用

```typescript
import express from "express"
import { readFileSync } from "fs"
import { createServer } from "https"

const app = express()
const server = createServer(
    {
        key: readFileSync("your-key.pem"),
        cert: readFileSync("your-cert.pem")
    },
    app
)

server.listen(3000)
```

在 Node.js 中使用 `fetch` 请求接口可能会报错：

```typescript
TypeError: fetch failed
    at Object.fetch (node:internal/deps/undici/undici:11730:11)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
  cause: Error: self-signed certificate
      at TLSSocket.onConnectSecure (node:_tls_wrap:1674:34)
      at TLSSocket.emit (node:events:514:28)
      at TLSSocket._finishInit (node:_tls_wrap:1085:8)
      at ssl.onhandshakedone (node:_tls_wrap:871:12) {
    code: 'DEPTH_ZERO_SELF_SIGNED_CERT'
  }
}
```

指定环境变量 `NODE_TLS_REJECT_UNAUTHORIZED='0'` 即可

```PowerShell
npx cross-env NODE_TLS_REJECT_UNAUTHORIZED='0' node index.js
```
