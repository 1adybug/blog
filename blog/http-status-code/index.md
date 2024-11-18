---
slug: http-status-code
title: HTTP 状态码
authors: [1adybug]
date: 2024-11-18
tags: [http]
---

| 状态码类别     | 状态码 | 英文说明              | 中文说明                                 |
| -------------- | ------ | --------------------- | ---------------------------------------- |
| 1xx 信息性     | 100    | Continue              | 继续。客户端应继续请求                   |
|                | 101    | Switching Protocols   | 切换协议。服务器同意切换协议             |
| 2xx 成功       | 200    | OK                    | 请求成功。一般用于 GET 与 POST 请求      |
|                | 201    | Created               | 已创建。成功请求并创建了新的资源         |
|                | 204    | No Content            | 无内容。服务器处理成功，但未返回内容     |
| 3xx 重定向     | 301    | Moved Permanently     | 永久移动。请求的资源已永久移动到新 URI   |
|                | 302    | Found                 | 临时移动。请求的资源临时移动到新 URI     |
|                | 304    | Not Modified          | 未修改。资源未改变，可使用缓存           |
| 4xx 客户端错误 | 400    | Bad Request           | 错误请求。请求语法错误                   |
|                | 401    | Unauthorized          | 未授权。需要身份验证                     |
|                | 403    | Forbidden             | 禁止。服务器拒绝请求                     |
|                | 404    | Not Found             | 未找到。服务器找不到请求的资源           |
|                | 405    | Method Not Allowed    | 方法禁用。不允许使用该请求方法           |
|                | 429    | Too Many Requests     | 请求过多。用户在给定时间内发送了太多请求 |
| 5xx 服务器错误 | 500    | Internal Server Error | 服务器内部错误                           |
|                | 502    | Bad Gateway           | 错误网关。服务器作为网关收到无效响应     |
|                | 503    | Service Unavailable   | 服务不可用。服务器暂时过载或维护         |
|                | 504    | Gateway Timeout       | 网关超时。服务器作为网关未及时响应       |
