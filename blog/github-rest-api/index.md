---
slug: github-rest-api
title: 使用接口的方式获取 Github 项目的目录
authors: [1adybug]
date: 2024-03-29
tags: [github]
---

要使用 API 的方式获取 GitHub 地址中某个特定目录的内容，可以通过 GitHub 的 REST API 实现。下面是一个基本的步骤指南：

获取仓库内容：使用 GitHub REST API 的 `/repos/{owner}/{repo}/contents/{path}` 可以获取仓库中特定路径的内容。这里的 `{owner}` 是仓库拥有者的用户名，`{repo}` 是仓库名，而 `{path}` 是你想要获取内容的目录路径。

认证：对于公共仓库，你可能不需要认证就可以请求这个 `API`。但是，对于私有仓库，你需要使用 `OAuth token` 或者其他形式的认证。

解析响应：API 的响应将以 `JSON` 格式返回，包含目录下的文件和子目录列表。你可以解析这个 `JSON` 来获取你需要的信息。

示例：

假设我们想要获取 GitHub 上 `octocat/Hello-World` 仓库根目录下的 `lib` 目录的内容。使用 `curl` 命令，请求看起来可能像这样：

```bash
curl https://api.github.com/repos/octocat/Hello-World/contents/lib
```

如果需要认证，可以在请求中添加 HTTP 头 `Authorization: token YOUR_TOKEN`，如下所示：

```bash
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/repos/octocat/Hello-World/contents/lib
```

:::warning

-   确保替换 YOUR_TOKEN 为你的实际 GitHub 访问令牌。
-   如果目录很大或有很多文件，GitHub 的 API 可能会进行分页处理。这种情况下，你可能需要处理分页逻辑，通过检查响应头中的 Link 字段来获取下一页数据。
-   为了避免过度使用 API 并受到限制，注意检查并遵守 GitHub 的速率限制政策。

:::

通过这种方式，你可以轻松地编程访问 GitHub 上任何公开或私有仓库的目录和文件内容。
