---
slug: install-docker-on-an-offline-linux-server
title: Docker 离线安装实战：从入门到精通的踩坑指南
authors: [Gemini, 1adybug]
date: 2025-09-15
tags: [docker, openeuler, linux]
---

> 以下内容均为 `Gemini 2.5 Pro Deep Research` 生成

在物理隔离或网络受限的环境中部署 Docker，是许多系统管理员面临的共同挑战。这不仅仅是下载一个安装包那么简单，而是一个涉及依赖解析、环境差异和软件包冲突的系统工程。本文将通过一个完整的实战案例，带您走过在类 RHEL 系统（如 CentOS, RHEL, openEuler）上离线安装 Docker 的每一步，并详细记录我们遇到的每一个错误、分析其根本原因，最终给出精准的解决方案。这不仅是一份操作指南，更是一份宝贵的排错实录。

## 第一阶段：在线准备——收集所有必要"弹药"

我们的第一步是在一台可以访问互联网的"在线"计算机上，下载 Docker Engine 及其所有的依赖项。

### 第1步：添加 Docker 官方软件仓库

在全新的系统中，软件包管理器（如 dnf）并不知道从哪里可以找到 Docker 的官方社区版（docker-ce）。如果我们直接尝试下载，就会遇到第一个错误：

❌ **初始错误 #1: No package docker-ce available**

```bash
# dnf download --resolve docker-ce...
Error: No package docker-ce available.
```

✅ **解决方案**：我们需要手动将 Docker 的官方仓库地址添加到系统的配置中。这样，dnf 才能索引到相关的软件包。

```bash
# 在您的在线计算机上执行
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

### 第2步：安装 dnf 下载插件

在某些精简安装的系统中，dnf 的 download 功能可能不是内置的，而是通过插件提供。这时，您可能会遇到第二个报错：

❌ **初始错误 #2: No such command: download**

```bash
# dnf download --resolve docker-ce...
No such command: download. Please use /usr/bin/dnf --help
It could be a DNF plugin command, try: "dnf install 'dnf-command(download)'"
```

✅ **解决方案**：报错信息已经给出了明确的指引。我们需要安装提供这个命令的插件包，它通常是 dnf-plugins-core 1。

```bash
# 在您的在线计算机上执行
sudo dnf install 'dnf-command(download)'
```

### 第3步：下载 Docker 及其完整依赖树

准备工作就绪，现在我们可以正式下载所有需要的 .rpm 文件了。然而，即使仓库配置正确，我们仍然可能遇到由系统版本差异导致的下载失败。

❌ **初始错误 #3: Status code: 404 for... repomd.xml**

```
Errors during downloading metadata for repository 'docker-ce-stable':
 - Status code: 404 for https://download.docker.com/linux/centos/24.03LTS_SP1/x86_64/stable/repodata/repomd.xml
Error: Failed to download metadata for repo 'docker-ce-stable'
```

这个错误告诉我们，dnf 尝试访问的 URL 是无效的。它自动将您系统的特定版本号（如 24.03LTS_SP1）拼接到了 URL 中，但 Docker 的仓库是按主版本号（如 8 或 9）组织的 3。

✅ **解决方案**：我们需要在命令中强制指定一个与 Docker 仓库结构兼容的发行版主版本号，使用 --releasever 标志即可 4。对于大多数现代系统，这个值是 9。

```bash
# 在您的在线计算机上执行
# 创建一个目录来存放所有软件包
mkdir docker-rpm-packages
cd docker-rpm-packages

# 执行最终的下载命令
sudo dnf download --releasever=9 --resolve docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

执行成功后，您的 docker-rpm-packages 目录里会装满所有离线安装所需的 .rpm 文件。至此，在线准备阶段圆满完成。

## 第二阶段：离线安装——直面冲突与挑战

现在，我们将准备好的 docker-rpm-packages 目录通过 U 盘等物理介质，完整地复制到目标离线服务器上。

### 第4步：执行安装

进入离线服务器上的软件包目录，我们开始执行安装。

❌ **关键错误 #4: 文件冲突**

```bash
# sudo dnf install *.rpm --disablerepo=*
...
file /usr/bin/docker-proxy from install of docker-ce... conflicts with file from package libnetwork...
```

这是一个非常典型的冲突。错误信息表明，我们尝试安装的官方 docker-ce 包，与离线系统上一个已存在的 libnetwork 包（通常是操作系统自带的容器网络组件）发生了文件冲突 5。

✅ **第一次尝试：使用 --allowerasing**

dnf 提供了一个强大的参数 --allowerasing，用于授权它在解决冲突时自动移除旧的、有冲突的软件包 4。这是解决此类问题的首选标准方法。

```bash
# 在您的离线服务器上执行
sudo dnf install *.rpm --disablerepo=* --allowerasing
```

然而，在某些复杂的系统环境中（如此次实战中的 openEuler），即使添加了这个参数，dnf 在最后的"事务测试"阶段仍然可能因为无法安全地自动解决冲突而报错退出。

❌ **关键错误 #5: 事务测试失败**

```bash
# sudo dnf install *.rpm --disablerepo=* --allowerasing
...
Running transaction test
Error: Transaction test error:
 file /usr/bin/docker-proxy from install of docker-ce... conflicts with file from package libnetwork...
```

✅ **最终解决方案：手动移除冲突根源**

当自动化的解决方案失效时，我们需要进行更精确的手动干预。既然 dnf 无法安全地为我们移除 libnetwork，那我们就亲自动手。首先，手动卸载引发冲突的软件包。移除这个包是安全的，因为我们即将安装的 docker-ce 会提供功能完整且版本匹配的替代品 8。

```bash
# 在您的离线服务器上执行
sudo dnf remove libnetwork
```

dnf 可能会提示此操作会一并移除其他依赖包，确认即可。然后，再次执行安装命令。在清除了最主要的障碍后，我们再次运行带有 --allowerasing 的安装命令，以处理任何其他潜在的次要冲突。

```bash
# 在您的离线服务器上执行
sudo dnf install *.rpm --disablerepo=* --allowerasing
```

这一次，安装过程畅通无阻，成功完成。

## 第三阶段：启动与验证

安装成功后，我们只需启动并验证 Docker 服务。

**启动并设置开机自启：**

```bash
sudo systemctl enable --now docker
```

**验证运行状态：**

```bash
sudo systemctl status docker
```

**运行 "Hello World"：**

由于是离线环境，您需要先将在在线计算机上用 docker save 打包好的镜像（例如 hello-world.tar）传输过来，然后用 docker load 导入。

```bash
# 加载镜像
sudo docker load -i /path/to/hello-world.tar

# 运行容器
sudo docker run hello-world
```

看到熟悉的欢迎信息，标志着本次高难度的离线 Docker 部署任务圆满成功。

## 总结

离线安装 Docker 的过程充满了挑战，但每一个错误都为我们揭示了其底层的运作机制。通过这次实战，我们不仅学会了如何准备离线包，更掌握了一套从分析错误到解决问题的系统性方法，特别是如何处理顽固的软件包冲突。希望这份详尽的踩坑指南，能为您在未来的工作中扫清障碍。
