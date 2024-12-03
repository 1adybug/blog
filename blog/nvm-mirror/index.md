---
slug: nvm-mirror
title: 修改 nvm 源为淘宝镜像
authors: [1adybug]
date: 2024-12-03
tags: [nvm, node]
---

仅限 `windows` 版，一共两种方法：

## 修改文件

在 `nvm` 的安装路径下，找到 `settings.txt` 文件，设置 `node_mirror` 与 `npm_mirror` 为国内镜像地址，在文件末尾加入：

阿里云镜像

```bash
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

腾讯云镜像

```bash
node_mirror: http://mirrors.cloud.tencent.com/npm/
npm_mirror: http://mirrors.cloud.tencent.com/nodejs-release/
```

## 命令行

阿里云镜像

```bash
nvm npm_mirror https://npmmirror.com/mirrors/npm/
nvm node_mirror https://npmmirror.com/mirrors/node/
```

腾讯云镜像

```bash
nvm npm_mirror http://mirrors.cloud.tencent.com/npm/
nvm node_mirror http://mirrors.cloud.tencent.com/nodejs-release/
```
