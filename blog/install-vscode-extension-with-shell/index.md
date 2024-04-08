---
slug: install-vscode-extension-with-shell
title: 使用命令行安装 VS Code 插件
authors: [1adybug]
date: 2024-04-08
tags: [vscode]
---

```powershell
# 在线安装
code --install-extension ms-python.python
# 本地安装
code --install-extension "本地vsix插件路径"
```

:::warning

安装时，请先关闭所有 VS Code 窗口，否则某些插件安装可能会卡主

:::
