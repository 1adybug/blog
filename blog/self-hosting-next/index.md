---
slug: self-hosting-next
title: 自托管 Next.js
authors: [1adybug]
date: 2025-06-18
tags: [Next.js, docker]
---

使用 `Next.js` 开发网站后，在自己的服务器上部署比较麻烦，有两种比较简单的解决方案：

- [自定义服务器](https://nextjs.org/docs/app/guides/custom-server)
- [Docker](https://github.com/vercel/next.js/tree/canary/examples/with-docker)

第一种不用过多介绍，这里主要介绍第二种方案：

1. 在 `next.config.ts` 中添加 `output: "standalone"`
2. 安装 `Docker`
3. 在项目根目录下创建 `Dockerfile` 文件

    ```dockerfile
    # syntax=docker.io/docker/dockerfile:1

    FROM node:22-alpine AS base

    # Install dependencies only when needed
    FROM base AS deps

    WORKDIR /app

    # Install dependencies based on the preferred package manager
    COPY package.json ./
    RUN npm install --registry=https://registry.npmmirror.com

    # Rebuild the source code only when needed
    FROM base AS builder
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .

    # Next.js collects completely anonymous telemetry data about general usage.
    # Learn more here: https://nextjs.org/telemetry
    ENV NEXT_TELEMETRY_DISABLED=1

    RUN npx prisma generate
    RUN npm run build

    # Production image, copy all the files and run next
    FROM base AS runner
    WORKDIR /app

    ENV NODE_ENV=production
    # Uncomment the following line in case you want to disable telemetry during runtime.
    ENV NEXT_TELEMETRY_DISABLED=1

    COPY --from=builder /app/public ./public

    # Automatically leverage output traces to reduce image size
    # https://nextjs.org/docs/advanced-features/output-file-tracing
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static

    EXPOSE 3000

    ENV PORT=3000

    # server.js is created by next build from the standalone output
    # https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
    ENV HOSTNAME="0.0.0.0"

    CMD ["node", "server.js"]
    ```

4. 在项目根目录下创建 `.dockerignore` 文件，主要内容应该和 `.gitignore` 类似，忽略一些不需要的文件，比如 `node_modules` 和 `.next` 目录之类的
5. 在 `package.json` 中添加 `"build:docker": "docker build -t your-app-name ."`

从 `Dockerfile` 中可以看出，自托管的核心就是 `standalone` 模式，这个模式下，`Next.js` 会生成一个 `server.js` 文件，这个文件是 `Next.js` 的入口文件，会自动监听 `3000` 端口，并启动 `Next.js` 应用。

其实，本质上最重要的产物就是 `.next/standalone` 目录，这个目录就是最终的根目录。所以最终目录结构应该是这样的：

`.next/standalone` → `app`

`.next/static` → `app/.next/static`

`public` → `app/public`

只要明白了这个原理，我们就可以再实现一个 `Next.js` 的“安装”程序：

在项目根目录下创建一个 `scripts/createInstaller.ts` 文件，内容如下：

```typescript
import { readdir, rm, writeFile } from "fs/promises"
import { resolve } from "path"
import { spawnAsync, zip } from "soda-nodejs"

const reg = /^--target=(windows|linux)$/

const target = (process.argv.find(item => reg.test(item))?.match(reg)?.[1] ?? "windows") as "windows" | "linux"

await rm("scripts/install.ts", { force: true })

await spawnAsync("bunx prisma generate", { shell: true, stdio: "inherit" })

await spawnAsync("bun run build:standalone", { shell: true, stdio: "inherit" })

const input = await readdir(".next/standalone")

await zip({ input, output: "../standalone.zip", cwd: ".next/standalone" })

const input2 = await readdir(".next/static")

await zip({ input: input2, output: "../static.zip", cwd: ".next/static" })

const input3 = await readdir("public")

await zip({ input: input3, output: "../.next/public.zip", cwd: "public" })

const script = `import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "fs/promises"
import { join, parse, resolve } from "path"
import { Readable } from "stream"
import { ReadableStream } from "stream/web"
import { styleText } from "util"
import { file } from "bun"
import { unzip } from "soda-nodejs"

import publicPath from "../.next/public.zip" with { type: "file" }
import standalonePath from "../.next/standalone.zip" with { type: "file" }
import staticPath from "../.next/static.zip" with { type: "file" }

${target === "windows" ? `import windowsPath from "../prisma/generated/query_engine-windows.dll.node" with { type: "file" }` : `import debianPath from "../prisma/generated/libquery_engine-debian-openssl-3.0.x.so.node" with { type: "file" }`}

const from = \`${resolve(".").replace(/\\/g, "\\\\")}\`.replace(/[\\\\/]$/, "")
const to = resolve(".").replace(/^[a-zA-Z]+/, m => m.toUpperCase()).replace(/[\\\\/]$/, "")
const from2 = encodeURIComponent(from)
const to2 = encodeURIComponent(to)
const from3 = encodeURIComponent(from + "/")
const to3 = encodeURIComponent(to + "/")
const from4 = encodeURIComponent(from + "\\\\")
const to4 = encodeURIComponent(to + "\\\\")

function escapeRegExp(str: string) {
    return str.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&")
}

const reg = new RegExp(
    \`\${escapeRegExp(from.replace(/[\\\\/]/g, "__PLACEHOLDER__")).replace(/__PLACEHOLDER__/g, "\\\\\\\\{0,3}[\\\\\\\\/]")}(\\\\\\\\{0,3}[\\\\\\\\/])?\`,
    "gi",
)

async function replacePath(dir: string) {
    const { name } = parse(dir)
    if (name === "node_modules") return
    const files = await readdir(dir)
    for (const file of files) {
        const path = join(dir, file)
        const status = await stat(path)
        if (status.isDirectory()) {
            await replacePath(path)
        } else {
            if (/\\.([mc]?js|json)$/i.test(path)) {
                const content = await readFile(path, "utf-8")
                const newContent = content
                    .replace(reg, (m, p) => {
                        const prefix = m.match(/(\\\\{0,3})[\\\\/]/)?.[1] ?? ""
                        const split = \`\${prefix}\${m.includes("/") ? "/" : "\\\\"}\`
                        return \`\${to.replace(/[\\\\/]/g, split)}\${p ? split : ""}\`
                    })
                    .replaceAll(from2, to2)
                    .replaceAll(from3, to3)
                    .replaceAll(from4, to4)
                await writeFile(path, newContent)
            }
        }
    }
}

async function main() {
    const publicStream = Readable.fromWeb(file(publicPath).stream() as ReadableStream)
    const standaloneStream = Readable.fromWeb(file(standalonePath).stream() as ReadableStream)
    const staticStream = Readable.fromWeb(file(staticPath).stream() as ReadableStream)
    ${target === "windows" ? `const windowsStream = Readable.fromWeb(file(windowsPath).stream() as ReadableStream)` : `const debianStream = Readable.fromWeb(file(debianPath).stream() as ReadableStream)`}

    await rm(".temp", { recursive: true, force: true })
    await mkdir(".temp", { recursive: true })

    await writeFile(".temp/public.zip", publicStream)
    await writeFile(".temp/standalone.zip", standaloneStream)
    await writeFile(".temp/static.zip", staticStream)

    await unzip({ input: ".temp/public.zip", output: ".temp/public" })
    await unzip({ input: ".temp/standalone.zip", output: ".temp/standalone" })
    await unzip({ input: ".temp/static.zip", output: ".temp/static" })

    const dir = await readdir(".temp/standalone")

    for (const item of dir) {
        await rm(item, { recursive: true, force: true })
        await rename(\`.temp/standalone/\${item}\`, item)
    }

    await rm("public", { recursive: true, force: true })
    await rename(".temp/public", "public")
    await rm(".next/static", { recursive: true, force: true })
    await rename(".temp/static", ".next/static")

    await replacePath(to)

    await mkdir("prisma/generated", { recursive: true })
    await ${target === "windows" ? `writeFile("prisma/generated/query_engine-windows.dll.node", windowsStream)` : `writeFile("prisma/generated/libquery_engine-debian-openssl-3.0.x.so.node", debianStream)`}

    await rm(".temp", { recursive: true, force: true })
    
    console.log(styleText("greenBright", "Task completed, the program will exit in 3 seconds..."))

    setTimeout(() => 0, 3000)
}

main()
`

await writeFile("scripts/install.ts", script)

await spawnAsync(`bun build --compile --target=bun-${target}-x64 --minify --sourcemap --bytecode scripts/install.ts --outfile installer`, {
    shell: true,
    stdio: "inherit",
})

await rm("scripts/install.ts", { force: true })

await rm(".next/standalone.zip", { force: true })

await rm(".next/static.zip", { force: true })

await rm(".next/public.zip", { force: true })
```

在 `package.json` 中添加以下命令：

```json
{
    "scripts": {
        "build:standalone": "npx cross-env NEXT_OUTPUT=standalone next build",
        "build:windows": "bun scripts/createInstaller.ts --target=windows",
        "build:linux": "bun scripts/createInstaller.ts --target=linux"
    }
}
```

因为我的项目中涉及到 `Prisma` ，所以需要生成 `Prisma` 的客户端，所以需要先执行 `prisma generate` 命令，然后执行 `build:standalone` 命令，生成 `standalone` 模式下的 `Next.js` 应用。又因为最终的平台涉及 `Windows` 和 `Linux` ，所以需要生成两个版本的 `.node` 文件，需要在 `schema.prisma` 中添加如下内容：

```prisma
generator client {
    binaryTargets          = ["windows", "debian-openssl-3.0.x"]
}
```

原理也很简单，就是将产物都使用 `bun` 打包，执行时再释放出来。
