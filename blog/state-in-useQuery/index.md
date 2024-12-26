---
slug: state-in-useQuery
title: useQuery 中的状态
authors: [1adybug]
date: 2024-12-26
tags: ["@tanstack/react-query", react-query, useQuery]
---

`@tanstack/react-query` 的 `useQuery` 分别提供了四种状态：

    - `isPending`：是否在等待数据，只要有数据存在，无论是缓存的，还是请求的，都不会是 `isPending`
    - `isFetching`：是否在请求数据
    - `isRefetching`：是否在重新请求数据
    - `isLoading`：是否在首次请求数据，等同于 `isPending && isFetching`

:::tip

同一个 `queryKey` 的这些状态是共享的

:::
