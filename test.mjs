// @ts-check
import { readdir, readFile, writeFile } from "fs/promises"
import { join } from "path"

async function main() {
  const dir = await readdir("blog")
  for (const item of dir) {
    if (item === "authors.yml") continue
    let content = await readFile(join("blog", item, "index.md"), "utf-8")
    content = content.replace(/```typescriptx/gim, "```tsx")
    await writeFile(join("blog", item, "index.md"), content, "utf-8")
  }
}

main()
