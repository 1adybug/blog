---
slug: remove-file-or-folder-from-git
title: 从 git 提交记录中删除文件或者文件夹
authors: [1adybug]
date: 2024-04-19
tags: [git]
---

有的时候我们会不小心误操作，将某些文件(夹)加入了 git 的提交记录，这并不是我们想要的，即使再添加进 gitignore 也无济于事，以下是解决办法：

```powershell npm2yarn
# 将 secrets.txt 替换为要删除的文件
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch secrets.txt" --prune-empty --tag-name-filter cat -- --all
# 或者添加 -r 参数，删除文件夹
git filter-branch --force --index-filter "git rm -r --cached --ignore-unmatch logs" --prune-empty --tag-name-filter cat -- --all
# 或者使用 zixulu 工具
npx zixulu rm-git secrets.txt
# 添加 -r 参数，删除文件夹
npx zixulu rm-git logs -r
```

:::warning

文件(夹)会被全部删除，包括当前分支，请提前做好备份

:::
