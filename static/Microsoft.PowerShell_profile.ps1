if ((Get-Location).Path -eq $env:USERPROFILE) {
    Set-Location $env:USERPROFILE\Desktop
}

Set-Alias bx bunx
Set-Alias c cls
Set-Alias p pnpm
Set-Alias y yarn
Set-Alias tapd tplugin-cli
Set-Alias ag antigravity

# 获取当前项目使用的包管理器
function GetPackageManager {
    # 获取当前目录的完整路径字符串
    $currentPath = (Get-Location).Path

    while ($null -ne $currentPath -and $currentPath -ne "") {
        # 按照优先级检查当前目录下的文件
        if ((Test-Path (Join-Path $currentPath "bun.lock")) -or (Test-Path (Join-Path $currentPath "bun.lockb"))) {
            return "bun"
        }
        if (Test-Path (Join-Path $currentPath "pnpm-lock.yaml")) {
            return "pnpm"
        }
        if (Test-Path (Join-Path $currentPath "yarn.lock")) {
            return "yarn"
        }
        if (Test-Path (Join-Path $currentPath "package-lock.json")) {
            return "npm"
        }

        # 获取父目录路径
        $parentPath = Split-Path $currentPath -Parent

        # 终止条件：如果父目录和当前目录一样（说明到了根目录，如 C:\）或者父目录为空
        if ($parentPath -eq $currentPath -or $null -eq $parentPath -or $parentPath -eq "") {
            break
        }

        # 迭代到上一级
        $currentPath = $parentPath
    }

    # Throw error if no lock file found
    throw "No package manager lock file found. Please make sure you are in a valid project directory."
}

function b { $pm = GetPackageManager; & $pm run build @args }

function bd { $pm = GetPackageManager; & $pm run build:docker @args }

function d { $pm = GetPackageManager; & $pm run dev @args }

function t { bunx tsc --noEmit @args }

function st { bunx tsc --noEmit --noUnusedLocals @args }

function lint { $pm = GetPackageManager; & $pm run lint @args }

function f { $pm = GetPackageManager; & $pm run format @args }

function format { $pm = GetPackageManager; & $pm run format @args }

function fg { $pm = GetPackageManager; & $pm run fg @args }

function i { $pm = GetPackageManager; & $pm install @args }

function delete { bunx rimraf @args }

function s { $pm = GetPackageManager; & $pm run start @args }

function u { $pm = GetPackageManager; & $pm update -i @args }

function sync { $pm = GetPackageManager; & $pm run sync @args }

function pub {
    npm publish @args
}

function patch { npm version patch @args }

function minor { npm version minor @args }

function major { npm version major @args }

function iall {
    $pm = GetPackageManager
    & $pm add @args
    $args | ForEach-Object { & $pm add -D "@types/$_" }
}

function inpm { 
    $pm = GetPackageManager
    $package = $args | ForEach-Object { "$_@latest" }
    & $pm add $package --registry=https://registry.npmjs.org 
}

function edit-history {
    $history = (Get-PSReadlineOption).HistorySavePath
    code $history
}

function edit-profile {
    code $PROFILE
}
