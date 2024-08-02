---
slug: use-https-in-nginx
title: 在 nginx 中使用 https
authors: [1adybug]
date: 2024-08-02
tags: [https, nginx]
---

```conf
http {
    server {
        # 网站端口
        listen 443 ssl;
        # 网站域名
        server_name urdomain.com;

        # 证书地址
        ssl_certificate /etc/letsencrypt/live/urdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/urdomain.com/privkey.pem;

        location / {

            #本地服务地址
            proxy_pass http://localhost:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```
