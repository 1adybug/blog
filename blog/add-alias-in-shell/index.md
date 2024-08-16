---
slug: add-alias-in-shell
title: 在 shell 中添加命令别名
authors: [1adybug]
date: 2024-08-02
tags: [alias, bash, zsh, powershell, pnpm]
---

1. 打开终端。

2. 编辑你的 `shell` 配置文件。例如，如果你使用的是 `bash`，则可以编辑 `~/.bashrc` 文件；如果你使用的是 `zsh`，则可以编辑 `~/.zshrc` 文件。如果你使用的是 `PowerShell`，则可以编辑 `$PROFILE` 文件。你可以使用以下命令来打开文件：

    ```bash
    <!-- bash -->
    vi ~/.bashrc

    <!-- zsh -->
    vi ~/.zshrc

    <!-- PowerShell -->
    notepad $PROFILE
    ```

3. 在文件的末尾添加以下行：

    ```bash
    <!-- bash 或者 zsh -->
    alias p="pnpm"

    <!-- PowerShell -->
    Set-Alias p pnpm
    ```

4. 保存文件并退出编辑器。

5. 你可以运行以下命令来重新加载你的 `shell` 配置文件使更改生效：

    ```bash
    <!-- bash -->
    source ~/.bashrc

    <!-- zsh -->
    source ~/.zshrc

    <!-- PowerShell -->
    . $PROFILE
    ```

现在，你可以在终端中使用 `p` 来代替 `pnpm` 运行命令。例如：

```bash
p install lodash
```

这样就会等同于运行 `pnpm install lodash`。
