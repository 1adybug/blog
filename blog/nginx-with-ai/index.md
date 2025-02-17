---
slug: nginx-with-ai
title: 使用 nginx 作为 ai 应用反向代理
authors: [1adybug]
date: 2025-02-17
tags: [nginx, stream, ai]
---

很多 ai 应用都是使用流式传输，需要对 nginx 进行配置，才能正确的反向代理。

```nginx
events {
    worker_connections 1024;
}

http {

    server {
        listen 11435;
        server_name 0.0.0.0;

        location / {
            proxy_pass http://host.docker.internal:11434;

            # 关闭缓存，确保流式输出
            proxy_buffering off;
            proxy_cache off;
            proxy_set_header Connection '';
            proxy_http_version 1.1;
            chunked_transfer_encoding off;

            # 增加超时时间，防止长响应被中断
            proxy_read_timeout 1800s;
            proxy_connect_timeout 60s;
            proxy_send_timeout 1800s;

            # 首先清除上游服务器可能发送的 CORS 头部
            proxy_hide_header 'Access-Control-Allow-Origin';
            proxy_hide_header 'Access-Control-Allow-Methods';
            proxy_hide_header 'Access-Control-Allow-Headers';
            proxy_hide_header 'Access-Control-Expose-Headers';
            proxy_hide_header 'Access-Control-Max-Age';

            # 移除 CORS 限制
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
            add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;

            # 处理 OPTIONS 请求
            if ($request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' '*';
                add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
                add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain; charset=utf-8';
                add_header 'Content-Length' 0;
                return 204;
            }

            # 代理设置
            proxy_set_header Host $host;
            # 传递真实 IP，如果后端服务屏蔽了客户端 IP，可以注释掉下面两行
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```
