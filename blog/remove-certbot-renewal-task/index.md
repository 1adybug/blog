---
slug: remove-certbot-renewal-task
title: 删除 certbot 自动续期任务
authors: [1adybug]
date: 2025-05-29
tags: [certbot, letsencrypt, ssl, https]
---

删除 `/etc/letsencrypt/renewal/` 相应的配置文件，如果有必要的话，删除 `/etc/letsencrypt/live/` 目录下的证书文件夹。
