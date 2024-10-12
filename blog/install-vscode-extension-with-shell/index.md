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

安装时，请先关闭所有 VS Code 窗口，否则某些插件安装可能会卡住。

:::

使用 `JavaScript` 安装目录下所有插件：

```ts
import { readdir } from "fs/promises"
import { spawn } from "child_process"

function spawnAsync(command: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, { shell: true, stdio: "inherit" })
    child.on("exit", code => {
      if (code !== 0) return reject(new Error(`Command failed with code ${code}`))
      resolve()
    })
  })
}

async function main() {
  const dir = await readdir("./")
  const exts = dir.filter(name => name.endsWith(".vsix"))
  for (const ext of exts) {
    await spawnAsync(`code --install-extension "${ext}"`)
  }
}

main()
```
