---
slug: gcTime-and-staleTime-in-useQuery
title: useQuery 中的 gcTime 和 staleTime
authors: [1adybug]
date: 2024-12-13
tags: ["@tanstack/react-query", react-query, useQuery]
---

`gcTime` 表示所有缓存数据回收时间。默认为 5 分钟。如果设置为 `Infinity`, 则表示缓存数据永不过期。如果存在多个 `gcTime` 值，则取缓存周期中的最大值。如果所有引用这个 `queryKey` 的 `hooks` 都被销毁了，那么这个 `queryKey` 的缓存数据也会被销毁。如果在销毁之后，又有新的 `hooks` 使用了这个 `queryKey`，分为两种情况：

1. 如果还在 `gcTime` 时间内，那么会直接使用缓存数据，且新的 `gcTime` 会加入到这个缓存周期中，即使这个 `gcTime` 比之前的 `gcTime` 小，也会取最大值
2. 如果超过了 `gcTime` 时间，那么会重新请求数据，会生成一个新的缓存周期

`staleTime` 表示缓存数据新鲜时间。默认为 `0`。在该时间间隔内，认为数据是新鲜的，不会重新发请求。如果设置为 `Infinity`，则表示数据永远新鲜。

之前也分析过 `ahooks` 中的 `useRequest`（参考[useRequest 中的 cacheTime 和 staleTime](/cacheTime-and-staleTime-in-useRequest))，规则复杂，心智负担严重，且在严格模式下数据不一致。`@tanstack/query` 中的 `useQuery` 明显更加优雅，且设计合理。
