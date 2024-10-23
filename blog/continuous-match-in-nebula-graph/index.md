---
slug: continuous-match-in-nebula-graph
title: Nebula Graph 中的连续匹配
authors: [1adybug]
date: 2024-10-23
tags: [nebula graph, match]
---

先看两组 Cypher 语句：

```ngql
MATCH p = (u:`user`)-[w:watched]->(m:`movie`)
WHERE w.rate > 4
RETURN count(p)
```

```ngql
MATCH (u:`user`)-[w:watched]->(m:`movie`)
WHERE w.rate > 4
MATCH p = (u:`user`)-[w:watched]->(m:`movie`)
RETURN count(p)
```

通过运行结果可知两组语句的结果是一样的，可知连续匹配的作用域就是上一个匹配的结果。 `u`、`w` 和 `m` 是上一个匹配的结果，所以第二组语句中的 `count(p)` 与第一组语句中的 `count(p)` 是一样的。

如果我们把第二组语句改为：

```ngql
MATCH (u:`user`)-[w:watched]->(m:`movie`)
WHERE w.rate > 4
MATCH p = (u:`user`)-[w2:watched]->(m:`movie`)
RETURN count(p)
```

那么此时，只有 `u` 和 `m` 是继承了上一次匹配的结果，`w2` 是重新匹配的结果，所以 `count(p)` 的结果就不一样了，也就是对于每一组 `u` 和 `m` 重新匹配了 `w2` 这条边，那么 `count(p)` 的结果必然是大于或者等于第一组语句的结果。

```ngql
MATCH (u:`user`)-[w:watched]->(m:`movie`)
WHERE w.rate > 4
WITH u, m
MATCH p = (u:`user`)-[w:watched]->(m:`movie`)
RETURN count(p)
```

此时如果我们使用 `WITH`，那么 `w` 依然被丢失了，在第二次匹配中的 `w` 也相当于重新匹配的结果，所以 `count(p)` 的结果也是大于或者等于第一组语句的结果。

如果我们做以下改动也是错误的：

```ngql
MATCH (u:`user`)-[w:watched]->(m:`movie`)
WHERE w.rate > 4
WITH u, m
MATCH p = (u:`user`)-[w:watched]->(m:`movie`)
WHERE w.rate > 4
RETURN count(p)
```

因为第一次匹配的结果并没有保证 `u` 和 `m` 之间的组合是独一无二的，也就是结果的列表中可能会存在系统的 `u` 和 `m` 组合，所以我们应该加一个语句：

```ngql
MATCH (u:`user`)-[w:watched]->(m:`movie`)
WHERE w.rate > 4
WITH u, m, count(w) as c
MATCH p = (u:`user`)-[w:watched]->(m:`movie`)
WHERE w.rate > 4
RETURN count(p)
```

通过 `count(w)` 就可以让 `u` 和 `m` 之间的组合是独一无二的
