---
slug: get-software-list-with-winget
title: 获取 winget 的软件清单
authors: [1adybug]
date: 2024-03-29
tags: [winget, github]
---

[winget](https://github.com/microsoft/winget-pkgs) 的所有软件清单都保存在 [manifests](https://github.com/microsoft/winget-pkgs/tree/master/manifests) 目录中。下一层的目录便是软件作者名称的首字母，比如 [Google.Chrome](https://github.com/microsoft/winget-pkgs/tree/master/manifests/g/Google/Chrome) 便是保存在 [manifests/g](https://github.com/microsoft/winget-pkgs/tree/master/manifests/g) 目录中 接下来使用 [GitHub REST API](/github-rest-api) 获取目录即可：

```typescript
import { HttpsProxyAgent } from "https-proxy-agent"
import fetch from "node-fetch"
import YAML from "yaml"

export namespace Winget {
    export interface Package {
        PackageIdentifier: string
        PackageVersion: string
        InstallerType: string
        InstallModes: string[]
        InstallerSwitches: InstallerSwitches
        ExpectedReturnCodes: ExpectedReturnCode[]
        UpgradeBehavior: string
        Protocols: string[]
        FileExtensions: string[]
        AppsAndFeaturesEntries: AppsAndFeaturesEntry[]
        Installers: Installer[]
        ManifestType: string
        ManifestVersion: string
    }

    export interface Installer {
        Architecture: string
        Scope: string
        InstallerUrl: string
        InstallerSha256: string
        InstallerSwitches: InstallerSwitches2
        ProductCode: string
    }

    export interface InstallerSwitches2 {
        Custom: string
    }

    export interface AppsAndFeaturesEntry {
        UpgradeCode: string
        InstallerType: string
    }

    export interface ExpectedReturnCode {
        InstallerReturnCode: number
        ReturnResponse: string
    }

    export interface InstallerSwitches {
        Log: string
    }
}

export async function getLatestVersion(softwareId: string): Winget.Package {
    const reg = /^(.+?)\.(.+?)$/
    const [, publisher, name] = softwareId.match(reg)!
    const agent = new HttpsProxyAgent("http://localhost:7890")
    const response = await fetch(`https://api.github.com/repos/microsoft/winget-pkgs/contents/manifests/${publisher[0].toLowerCase()}/${publisher}/${name}`, { agent })
    const data: GithubContent[] = (await response.json()) as any
    const reg2 = /^\d+(\.\d+?)*$/
    const stables = data.filter(item => reg2.test(item.name))
    stables.sort((a, b) => {
        const avs = a.name.split(".")
        const bvs = b.name.split(".")
        const max = Math.max(avs.length, bvs.length)
        for (let i = 0; i < max; i++) {
            const av = avs[i] ? parseInt(avs[i]) : 0
            const bv = bvs[i] ? parseInt(bvs[i]) : 0
            if (av < bv) return 1
            if (av > bv) return -1
        }
        return 0
    })
    const response2 = await fetch(`https://raw.githubusercontent.com/microsoft/winget-pkgs/master/manifests/${publisher[0].toLowerCase()}/${publisher}/${name}/${stables[0].name}/${id}.installer.yaml`, { agent })
    const yaml = await response2.text()
    return YAML.parse(yaml)
}
```

:::tip

- 使用 [YAML](https://www.npmjs.com/package/yaml) 来将 YAML 文件格式化为 JSON
- `Installer` 的 `Scope` 字段有两个可能的值：`user` 和 `machine`
  - **user**：当 `Scope` 被设置为 `user` 时，意味着安装操作仅针对当前用户进行。安装的程序或者应用将仅对当前用户可用，安装的结果（如程序文件和快捷方式）将被存储在用户的个人目录下（例如，在 `Windows` 系统中可能是 `C:\Users\[用户名]\` 下的某个目录），并且只有当前用户有权限运行或修改。这种安装方式不需要管理员权限，但安装的程序只能由安装它的用户使用。
  - **machine**：当 `Scope` 被设置为 `machine` 时，表明安装是针对整个系统进行的，安装的程序或应用将对所有用户可用。这通常意味着程序会被安装在系统级的目录下（例如，在 `Windows` 系统中可能是 `C:\Program Files\`），并且安装、运行或修改程序可能需要管理员权限。这种安装方式确保了所有使用该机器的用户都可以访问到安装的程序。

:::

:::warning

- 由于国内的网络环境限制，可能需要[为 fetch 配置代理](/use-fetch-with-proxy)
- 示例函数对于版本号使用了 `^\d+(\.\d+?)*$` 正则表达式进行了过滤，也就是只接受 `数字.数字.数字...` 形式的版本
- 示例函数的返回结果并不一定严格符合 `Winget.Package` 类型，只是以 `Google.Chrome` 为例

:::
