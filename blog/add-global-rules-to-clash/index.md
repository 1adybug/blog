---
slug: add-global-rules-to-clash
title: 在 Clash 中添加全局规则
authors: [1adybug]
date: 2024-10-14
tags: [clash]
---

有时候我们希望某些网站不走代理，这时候就需要添加自定义规则，右击订阅，选择扩展脚本：

```javascript
// Define main function (script entry)

/**
 * @param {object} config 
 * @param {string[]} config.rules 
 * @param {string} profileName 
 */
function main(config, profileName) {
  config.rules.unshift("DOMAIN-SUFFIX,axshare.com,DIRECT")
  config.rules.unshift("DOMAIN-SUFFIX,bing.com,DIRECT")
  config.rules.unshift("DOMAIN-SUFFIX,codesandbox.io,DIRECT")
  config.rules.unshift("DOMAIN-SUFFIX,csbops.io,DIRECT")
  config.rules.unshift("DOMAIN-SUFFIX,csb.app,DIRECT")
  config.rules.unshift("DOMAIN-SUFFIX,gallerycdn.vsassets.io,节点选择")
  config.rules.unshift("DOMAIN-SUFFIX,gallery.vsassets.io,节点选择")
  config.rules.unshift("DOMAIN-SUFFIX,marketplace.visualstudio.com,节点选择")
  return config;
}
```

`DOMAIN` 是指定域名，`DOMAIN-SUFFIX` 是指定域名后缀，`DIRECT` 和 `节点选择` 都是规则内的分组。
