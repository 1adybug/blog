---
slug: docker-registry
title: 修改 Docker 镜像
authors: [1adybug]
date: 2024-12-25
tags: [docker]
---

1. 创建目录 `/etc/docker`：

    ```bash
    sudo mkdir -p /etc/docker
    ```

2. 创建并编辑文件 `/etc/docker/daemon.json`：

    ```bash
    sudo vim /etc/docker/daemon.json
    ```

    添加以下内容：

    ```json
    {
        "registry-mirrors": [
            "https://docker.sunzishaokao.com",
            "https://hub.hxui.site",
            "https://docker.1ms.run"
        ],
        "exec-opts": ["native.cgroupdriver=systemd"]
    }
    ```

    其中 `registry-mirrors` 为镜像地址，根据实际情况替换。

3. 重启 Docker 服务：

    ```bash
    sudo systemctl daemon-reload
    sudo systemctl restart docker
    ```
