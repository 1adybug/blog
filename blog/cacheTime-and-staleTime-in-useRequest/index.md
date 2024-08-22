---
slug: cacheTime-and-staleTime-in-useRequest
title: useRequest 中的 cacheTime 和 staleTime
authors: [1adybug]
date: 2024-08-22
tags: [ahooks, useRequest, cacheTime, staleTime]
---

`cacheTime` 表示缓存数据回收时间。默认为 5 分钟。如果设置为 `-1`, 则表示缓存数据永不过期

`staleTime` 表示缓存数据新鲜时间。默认为 `0`。在该时间间隔内，认为数据是新鲜的，不会重新发请求。如果设置为 `-1`，则表示数据永远新鲜

`cacheTime` 表示数据在全局的缓存时间，即使到期被销毁了，也不影响已经加载完成的请求，它们的 `data` 依然是有有效数据的，不会重新请求。但是如果有新的组件（请求）产生了，此时它 `data` 便无法从全局的缓存中读取数据，因此初始 `data` 是 `undefined`，会进行一次新的请求，在请求完成后会同步更新所有相同的 `cacheKey` 的 `hooks` 的 `data`

`stableTime` 表示数据的新鲜时间，在新鲜的时间内，产生了新的请求，不会真正地去请求，而是使用全局缓存中的数据，如果全局缓存中的数据不存在，依然会进行一次真正的请求，在请求完成后会同步更新所有相同的 `cacheKey` 的 `hooks` 的 `data`
