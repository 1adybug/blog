---
slug: exec-and-spawn
title: Node.js 中 child_process 模块中的 exec 和 spawn
authors: [1adybug]
date: 2024-04-23
tags: [node.js, child_process, exec, spawn]
---

Node.js 的 `child_process` 模块允许你从 Node.js 应用程序内部运行其他程序和命令。它是一个非常强大的功能，可以用来执行操作系统级别的任务，例如启动一个新的进程来处理 CPU 密集型工作或者运行系统命令。

`child_process` 模块是 Node.js 中一个强大的模块，它被用于各种场景，如：

- 在后台运行定时任务 (比如，备份数据库)
- 利用多核 CPU 优势来提高应用性能
- 运行系统命令，进行文件操作
- 实现基本的并行处理

运用这个模块可以帮助你的 Node.js 应用与操作系统更紧密地交互，从而执行一些复杂的任务。不过，也需要注意，错误地使用 `child_process` 模块可能会导致安全问题，比如如果用户输入没有得到恰当的处理，就可能会引发命令注入攻击。因此，在使用它时必须小心谨慎。

这里有几个主要的函数和类，你可以通过 `child_process` 模块使用：

## exec

`exec` 用于执行一个命令并且将结果以回调函数的形式返回。它适合用于那些产生少量输出的情况

```JavaScript
const { exec } = require("child_process")

exec("ls", (error, stdout, stderr) => {
    if (error) {
        console.error(`执行的错误: ${error}`)
        return
    }
    console.log(`stdout: ${stdout}`)
    console.error(`stderr: ${stderr}`)
})
```

在这个例子中，我们使用了 `exec` 函数来运行 `ls` 命令，这个命令会列出当前文件夹中的所有文件。如果执行成功，它的输出会被打印到控制台。

调用方法：`exec(command[, options][, callback])`

参数解释：

1. command (必须): 你想要执行的命令字符串。
2. options (可选): 一个对象，可以用来定制操作的各种设置，例如：
    - `cwd`：指定子进程的当前工作目录。
    - `env`：环境变量键值对。
    - `encoding`：输出的编码。
    - `timeout`：超时时间，过了这个时间子进程会被杀掉。
    - `shell`：要使用的 shell，如果不指定，默认在 UNIX 上是 `/bin/sh`，在 Windows 上是 `cmd.exe`。
3. callback (可选): 当进程终止或有错误发生时调用的回调函数，其参数包括：
    - `error`：错误对象或者 `null`。
    - `stdout`：子进程的标准输出。
    - `stderr`：子进程的标准错误输出。

## execFile

在计算机中，进程（Process）是正在运行的程序的实例。Node.js 提供了一个 `child_process` 模块，使得它可以从 Node.js 程序中创建和控制子进程。`execFile` 函数是这个模块中的一个非常有用的方法，用于创建一个新的子进程来执行一个指定的程序文件，并且可以传递参数给这个程序

调用方法：`execFile(file[, args][, options][, callback])`

参数解释：

1. file (必须)：这是你想要执行的可执行文件的名称或者路径。如果这个文件在系统的 PATH 环境变量里定义的目录中，你可以直接提供文件名；否则，你需要提供完整的路径。

2. args (可选)：这是一个可选参数，是一个数组，包含所有你想要传递给程序的命令行参数。

3. options (可选)：同 [exec](#exec) 中的 options

4. callback (可选)：同 [exec](#exec) 中的 callback

## spawn

与 `exec` 相比，`spawn` 会返回一个流（`Stream`），这使得它更适用于需要处理大量数据的情况。

```JavaScript
const { spawn } = require("child_process")

const child = spawn("find", ["."])

child.stdout.on("data", data => {
    console.log(`stdout: ${data}`)
})

child.stderr.on("data", data => {
    console.error(`stderr: ${data}`)
})

child.on("close", code => {
    console.log(`子进程退出码：${code}`)
})
```

## fork

这个函数是特别为 Node.js 模块设计的。它允许你创建一个 Node.js 进程，并运行一个模块。这对于在后台执行一个任务特别有用，而不必担心阻塞主事件循环。

```JavaScript
const { fork } = require("child_process")

const child = fork("some-module.js")

child.on("message", message => {
    console.log("收到消息:", message)
})

child.send({ hello: "world" })
```

在这个例子中，`fork` 创建了一个新的 Node.js 进程来运行 `some-module.js` 文件。父进程通过 `.send()` 方法发送消息给子进程，并通过监听 `message` 事件来接受子进程发送的消息。

...todo
