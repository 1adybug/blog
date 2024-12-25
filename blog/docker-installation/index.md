---
slug: docker-installation
title: Docker 安装
authors: [1adybug]
date: 2024-12-25
tags: [docker]
---

使用 `apt` 命令安装很有可能失败，参考官方教程 [install-from-a-package](https://docs.docker.com/engine/install/ubuntu/#install-from-a-package)：

1. 转至 [https://download.docker.com/linux/ubuntu/dists/](https://download.docker.com/linux/ubuntu/dists/)

2. 在列表中选择 `Ubuntu` 版本

3. 转到 `pool/stable/` 并选择适用的架构（`amd64`、 `armhf`、`arm64` 或 `s390x`）

4. 下载 `Docker Engine`、`CLI`、`containerd` 和 `Docker Compose` 软件包的以下 `deb` 文件：

    - `containerd.io_<version>_<arch>.deb`
    - `docker-ce_<version>_<arch>.deb`
    - `docker-ce-cli_<version>_<arch>.deb`
    - `docker-buildx-plugin_<version>_<arch>.deb`
    - `docker-compose-plugin_<version>_<arch>.deb`

5. 安装 `.deb` 软件包。将以下示例中的路径更新为您下载 `Docker` 软件包的位置。

    ```bash
    sudo dpkg -i ./containerd.io_<version>_<arch>.deb \
    ./docker-ce_<version>_<arch>.deb \
    ./docker-ce-cli_<version>_<arch>.deb \
    ./docker-buildx-plugin_<version>_<arch>.deb \
    ./docker-compose-plugin_<version>_<arch>.deb
    ```

    `Docker` 守护进程自动启动。

6. 通过运行 `hello-world` 镜像来验证安装是否成功：

    ```bash
    sudo service docker start
    sudo docker run hello-world
    ```

    此命令下载测试映像并在容器中运行。容器运行时，它会打印一条确认消息并退出。

现已成功安装并启动了 `Docker Engine`
