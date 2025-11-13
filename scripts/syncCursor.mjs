// @ts-check

import { copyFile, writeFile } from "fs/promises"
import { homedir } from "os"
import { join } from "path"

import { execAsync } from "soda-nodejs"

/**
 * @param {string | undefined} [cwd]
 */
export async function hasChangeNoCommit(cwd) {
    const status = await execAsync("git status", { cwd })
    return !status.includes("nothing to commit, working tree clean")
}

async function main() {
    if (await hasChangeNoCommit()) {
        console.error("请先提交当前修改")
        return
    }

    const userDir = homedir()
    const path = join(userDir, "AppData/Roaming/Cursor/User/snippets/global.code-snippets")
    await copyFile(path, "static/global.code-snippets")
    const path2 = join(userDir, "AppData/Roaming/Cursor/User/settings.json")
    await copyFile(path2, "static/settings.json")
    const cursorOutput = await execAsync("cursor --list-extensions")

    const cursorExtensions = cursorOutput
        .split("\n")
        .map(item => item.trim())
        .filter(Boolean)

    await writeFile("static/extensions.json", JSON.stringify(cursorExtensions, null, 4))

    if (!(await hasChangeNoCommit("."))) {
        console.error("没有发现 Cursor 设置的变化")
        return
    }

    await execAsync("git add .")
    await execAsync(`git commit -m "✨feature: 更新 Cursor 设置"`)
    await execAsync("git push")
    console.log("Cursor 设置同步成功")
}

main()
