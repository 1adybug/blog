---
slug: ubuntu-registry
title: 修改 Ubuntu 镜像源
authors: [1adybug]
date: 2024-12-25
tags: [ubuntu]
---

1. 首先确定 Ubuntu 版本代号：

    ```bash
    lsb_release -c
    ```

    常见的版本代号：

    - 16.04 xenial
    - 18.04 bionic
    - 20.04 focal
    - 22.04 jammy
    - 24.04 noble

2. 备份原有的源文件：

    ```bash
    sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
    ```

3. 修改源文件：

    ```bash
    sudo vim /etc/apt/sources.list
    ```

    将文件内容替换为以下内容：

    ```bash
    # 中科大镜像源
    deb https://mirrors.ustc.edu.cn/ubuntu/ noble main restricted universe multiverse
    deb https://mirrors.ustc.edu.cn/ubuntu/ noble-updates main restricted universe multiverse
    deb https://mirrors.ustc.edu.cn/ubuntu/ noble-backports main restricted universe multiverse
    deb https://mirrors.ustc.edu.cn/ubuntu/ noble-security main restricted universe multiverse
    ```

    其中 `noble` 为 Ubuntu 版本代号，根据实际情况替换。

4. 更新源：

    ```bash
    sudo apt update
    ```
