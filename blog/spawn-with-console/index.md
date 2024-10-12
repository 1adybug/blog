---
slug: spawn-with-console
title: 打印长时间运行命令的输入
authors: [1adybug]
date: 2024-02-23
tags: [child_process, spawn, exec, console, node.js]
---

如果你想要实时打印长时间运行命令的输出，比如监控某个过程的日志输出，你应该使用 `child_process` 中的 `spawn` 来代替 `exec`，因为 `spawn` 提供了一个流式接口，可以让你实时接收数据。下面是一个使用 `spawn` 实时打印输出的示例：

```typescript
import { spawn } from "child_process"

const child = spawn("node -v", { shell: true })

child.stdout.on("data", data => {
  console.log(`stdout: ${data}`)
})

child.stderr.on("data", data => {
  console.error(`stderr: ${data}`)
})

child.on("close", code => {
  console.log(`child process exited with code ${code}`)
})
```

这段代码会实时打印出命令的标准输出和标准错误输出。使用 `spawn` 时，你可以通过监听 `data` 事件来实时获取命令的输出。这对于需要实时监控输出的场景非常有用。

记得替换 `your_long_running_command_here` 为你想要执行的实际命令。

在命令行中执行的许多命令会使用特殊的 `ANSI` 转义序列来改变输出的字体颜色或样式，从而使输出更易于阅读。默认情况下，当这些命令通过 `Node.js` 的 `spawn` 函数执行时，它们可能检测到自己不是在一个交互式终端环境中运行，因此可能不会输出这些颜色或样式。

要使 `spawn` 打印的输出效果与直接在命令行中执行的效果一样（包括字体颜色），你可以尝试以下几种方法：

1. 强制命令以颜色输出

   一些命令提供了参数或环境变量来强制启用颜色输出，即使输出被重定向。例如，很多命令支持 `--color` 选项：

   ```javascript
   import { spawn } from "child_process"

   const child = spawn("some-command", ["--color", "always"])
   ```

   对于那些不支持此类选项的命令，可能需要查看该命令的文档，看是否有其他方法可以强制启用颜色输出。

2. 使用 `shell` 选项

   通过在 `spawn` 中设置 `shell: true` 选项，可以在一个 `shell` 环境中执行命令。这样做可能会鼓励一些命令输出颜色，因为它们“认为”自己是在一个终端中运行：

   ```javascript
   import { spawn } from "child_process"

   const child = spawn("some-command", ["arg1", "arg2"], { shell: true })
   ```

3. 保持输出到进程的标准输出

   如果你只是想要在 `Node.js` 脚本中直接查看输出（包括颜色），而不是处理输出数据，你可以将子进程的 `stdout` 和 `stderr` 直接连接到主进程的 `stdout` 和 `stderr`：

   ```javascript
   import { spawn } from "child_process"

   const child = spawn("some-command", ["arg1", "arg2"], { stdio: "inherit" })
   ```

   使用 `stdio: "inherit"` 选项，子进程的输出会直接显示在终端中，包括所有的颜色和格式化。

   示例
   假设你想要使用 `spawn` 执行 `git status` 命令，并希望输出包含颜色：

   ```javascript
   import { spawn } from "child_process"

   // 注意：这里使用shell: true来确保命令在shell中执行，可能有助于保留颜色输出
   const child = spawn("git", ["status", "--color=always"], { shell: true, stdio: "inherit" })

   child.on("exit", function (code, signal) {
     console.log(`子进程退出，退出码 ${code}`)
   })
   ```

   这个例子中，`--color=always` 告诉 `git status` 命令总是使用颜色输出，`shell: true` 确保在一个 shell 环境中执行命令，`stdio: "inherit"` 使得命令的输出直接显示在终端中，包括颜色。

:::warning

使用 `shell: true` 可能会增加安全风险，特别是当命令的参数来自不可信的源时。因此，只有在确实需要时才使用这个选项，并确保对输入进行适当的清理和验证。

:::
