---
slug: start-git
title: git 起步
authors: [1adybug]
date: 2024-08-08
tags: []
---

1. 设置用户名和邮箱

    ```shell
    git config --global user.name "Your Name"
    git config --global user.email "your_email@example.com"
    ```

2. 生成 ssh 密钥

    ```shell
    ssh-keygen -t ed25519 -C "your_email@example.com"
    ```

3. 设置代理

    ```shell
    git config --global http.proxy http://proxyusername:proxypassword@proxy.server.com:port
    git config --global https.proxy https://proxyusername:proxypassword@proxy.server.com:port
    ```
