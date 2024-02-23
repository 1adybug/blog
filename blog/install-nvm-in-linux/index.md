---
slug: install-nvm-in-linux
title: 在 linux 中安装 nvm
authors: [1adybug]
date: 2024-02-23
tags: [node, nvm, linux, git]
---

由于国内的网络环境限制，直接安装 [nvm](https://github.com/nvm-sh/nvm) 脚本会失败：

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

此时可以使用国内的 [gitee](https://gitee.com/mirrors/nvm) 镜像源：`https://gitee.com/mirrors/nvm`

```sh
git clone https://gitee.com/mirrors/nvm
cd nvm
bash install.sh
```
