---
slug: add-global-rules-to-clash
title: 在 Clash 中添加全局规则
authors: [1adybug]
date: 2024-10-14
tags: [clash]
---

有时候我们希望某些网站不走代理，这时候就需要添加全局规则。编辑脚本文件：

```javascript
// Define main function (script entry)

function main(config, profileName) {
  config.rules.unshift("DOMAIN-SUFFIX,bing.com,DIRECT")
  return config
}
```

`DOMAIN` 是指定域名，`DOMAIN-SUFFIX` 是指定域名后缀，`DIRECT` 是直连，`PROXY` 是代理。
