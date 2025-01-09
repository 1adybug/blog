// @ts-check

import { copyFile } from "fs/promises"
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
    const path = join(userDir, "AppData/Roaming/Code/User/snippets/global.code-snippets")
    await copyFile(path, "static/global.code-snippets")
    if (await hasChangeNoCommit(".")) {
        await execAsync("git add .")
        await execAsync(`git commit -m "✨feature: 更新代码片段"`)
        await execAsync("git push")
    }
}

main()
