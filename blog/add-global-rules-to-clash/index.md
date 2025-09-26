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
    return config
}
```

`DOMAIN` 是指定域名，`DOMAIN-SUFFIX` 是指定域名后缀，`DIRECT` 和 `节点选择` 都是规则内的分组。

有时候我们希望某些规则对于所有的订阅都生效，这时候我们可以右击 `全局扩展脚本`，选择编辑文件：

```javascript
// Define main function (script entry)

/**
 * @param {object} config
 * @param {string[]} config.rules
 * @param {string} profileName
 */
function main(config, profileName) {
    /** @type string | undefined */
    const name = config["proxy-groups"]?.at(0)?.name
    config.rules.unshift(`DOMAIN-SUFFIX,neo4j.com,${name}`)
    return config
}
```

这里的意思找到订阅的第一个分组（一般都是通用的代理规则），然后将这条规则添加到这个分组中。

如果需要对于脚本进行调试，可以添加 `console.log`，在保存脚本以后，会在 `全局扩展脚本` 下方出现一个日志按钮，点击以后会输出脚本的日志。
