---
slug: marzneshin-npm-vless-ws-tls-guide
title: 从零搭建 Marzneshin + Nginx Proxy Manager + VLESS WS TLS 代理服务器
authors: [1adybug]
date: 2026-05-26
tags: [marzneshin, vless, clash verge, mihomo]
---

本文记录一套可以复刻的代理服务器搭建流程。最终效果是：

- 只暴露公网 `80` 和 `443`。
- 使用 Nginx Proxy Manager 统一管理 HTTPS、证书和反向代理。
- Marzneshin 面板通过 `https://<PROXY_DOMAIN>/dashboard/` 访问。
- 代理节点使用 `VLESS + WebSocket + TLS`，客户端连接 `<PROXY_DOMAIN>:443`。
- Xray 实际后端只监听 Docker 网关 `172.17.0.1:2087`，不直接暴露到公网。
- Marzneshin 面板后端只监听 `172.17.0.1:8000`，不直接暴露到公网。
- Clash Verge / Mihomo 订阅自带分流规则：国内直连，Google / Telegram / GFW / 非中国域名走代理。
- 规则文件通过自己的域名反代：`https://<PROXY_DOMAIN>/rules/google.txt`，客户端不直接访问 GitHub 或 jsDelivr。
- 修复部分 Clash 客户端订阅名显示成 `\"用户名\` 的问题。

示例环境：

```text
系统：Ubuntu 22.04 LTS
服务器公网 IP：<SERVER_IP>
域名：<PROXY_DOMAIN>
面板端口：172.17.0.1:8000
Xray WS 后端端口：172.17.0.1:2087
WebSocket 路径：<WS_PATH>
```

实际使用时，把 `<PROXY_DOMAIN>`、用户名、密码、服务器 IP 替换成你自己的值。不要把真实密码写进博客或公开仓库。

## 1. DNS 准备

先在你的 DNS 服务商处添加解析：

```text
类型：A
主机记录：clash
记录值：<SERVER_IP>
```

等待生效后检查：

```bash
dig +short <PROXY_DOMAIN>
```

应该返回你的服务器公网 IP。

## 2. 安装 Docker 和 Docker Compose

登录服务器：

```bash
ssh root@<SERVER_IP>
```

安装 Docker 官方源：

```bash
apt update
apt install -y ca-certificates curl gnupg lsb-release

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" \
  > /etc/apt/sources.list.d/docker.list

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

验证：

```bash
docker --version
docker compose version
docker run --rm hello-world
```

本文实测版本：

```text
Docker version 29.5.2
Docker Compose version v5.1.4
```

## 3. 安装 Marzneshin

Marzneshin 官方基础安装命令：

```bash
sudo bash -c "$(curl -sL https://github.com/marzneshin/Marzneshin/raw/master/script.sh)" @ install
```

安装完成后创建管理员：

```bash
marzneshin cli admin create --sudo
```

按提示输入管理员用户名和密码。示例：

```text
username: admin
password: <ADMIN_PASSWORD>
```

安装后主要文件位置：

```text
/etc/opt/marzneshin/.env
/etc/opt/marzneshin/docker-compose.yml
/var/lib/marzneshin/db.sqlite3
/var/lib/marznode/xray_config.json
```

初始状态下，面板通常可以通过：

```text
http://<SERVER_IP>:8000/dashboard/
```

访问。后面我们会把它改成只监听 Docker 网关，由 NPM 统一暴露 HTTPS。

## 4. 安装 Nginx Proxy Manager

创建目录：

```bash
mkdir -p /home/projects/nginx
cd /home/projects/nginx
```

写入 `/home/projects/nginx/docker-compose.yml`：

```yaml
services:
    npm:
        image: "jc21/nginx-proxy-manager:latest"
        container_name: nginx-proxy-manager
        restart: always
        ports:
            - "443:443"
            - "127.0.0.1:81:81"
            - "80:80"
        volumes:
            - ./data:/data
            - ./letsencrypt:/etc/letsencrypt
        networks:
            - web_proxy

        extra_hosts:
            - "host.docker.internal:host-gateway"

networks:
    web_proxy:
        name: web_proxy
        driver: bridge
```

启动：

```bash
docker compose up -d
docker ps --filter name=nginx-proxy-manager
```

这里把 NPM 管理后台端口绑定到 `127.0.0.1:81`，公网不能直接访问，更安全。需要登录 NPM 管理后台时，在本地电脑开 SSH 隧道：

```bash
ssh -L 8181:127.0.0.1:81 root@<SERVER_IP>
```

然后浏览器打开：

```text
http://127.0.0.1:8181
```

首次登录后立刻修改 NPM 默认账号密码。

## 5. 让 Marzneshin 面板只监听 Docker 网关

编辑：

```bash
nano /etc/opt/marzneshin/.env
```

设置：

```dotenv
UVICORN_HOST="172.17.0.1"
UVICORN_PORT=8000
```

重启 Marzneshin：

```bash
cd /etc/opt/marzneshin
docker compose up -d
```

检查监听：

```bash
ss -tulpen | grep -E '(:8000|:80|:443)'
```

理想结果：

```text
0.0.0.0:80      -> NPM
0.0.0.0:443     -> NPM
172.17.0.1:8000 -> Marzneshin 面板
```

此时公网 `http://<SERVER_IP>:8000` 应该访问不到，这是安全设计。

## 6. 在 NPM 中创建 Marzneshin 面板代理

进入 NPM 后创建 Proxy Host。

### Details

```text
Domain Names: <PROXY_DOMAIN>
Scheme: http
Forward Hostname / IP: 172.17.0.1
Forward Port: 8000
Cache Assets: 可开启
Block Common Exploits: 开启
Websockets Support: 开启
```

### SSL

```text
Request a new SSL Certificate: 开启
Force SSL: 开启
HTTP/2 Support: 可按需开启
Email: 你的邮箱
I Agree: 勾选
```

保存后访问：

```text
https://<PROXY_DOMAIN>/dashboard/
```

如果能看到登录页，面板反代完成。

## 7. 创建 VLESS WebSocket 入站

进入 Marzneshin 面板，创建一个入站。核心目标是：

```text
协议：vless
传输：ws
监听地址：172.17.0.1
监听端口：2087
WebSocket Path：<WS_PATH>
```

注意：这里的 Xray 后端不需要自己处理 TLS。TLS 由 NPM 在 `443` 端口终止，NPM 再把 WebSocket 请求转发到 `172.17.0.1:2087`。

推荐入站概念配置：

```text
Tag / Name: vless WS
Protocol: vless
Network: ws
Listen: 172.17.0.1
Port: 2087
Path: <WS_PATH>
TLS: none / disabled
```

再创建 Host，告诉客户端应该怎么连：

```text
Address: <PROXY_DOMAIN>
Port: 443
Protocol: vless
Network: ws
Path: <WS_PATH>
Security: tls
SNI: <PROXY_DOMAIN>
Host: <PROXY_DOMAIN>
Fingerprint: chrome
```

保存后检查监听：

```bash
ss -tulpen | grep 2087
```

理想结果：

```text
172.17.0.1:2087 -> xray
```

## 8. 在 NPM 中添加 WebSocket 转发路径

编辑 `<PROXY_DOMAIN>` 这个 Proxy Host，添加 Custom Location：

```text
Location: <WS_PATH>
Scheme: http
Forward Hostname / IP: 172.17.0.1
Forward Port: 2087
```

在这个 location 的高级配置里加入：

```nginx
proxy_set_header Host $host;
proxy_set_header X-Forwarded-Scheme $scheme;
proxy_set_header X-Forwarded-Proto  $scheme;
proxy_set_header X-Forwarded-For    $remote_addr;
proxy_set_header X-Real-IP          $remote_addr;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection $http_connection;
proxy_http_version 1.1;
proxy_read_timeout 3600s;
proxy_send_timeout 3600s;
```

保存后，NPM 生成的效果大致类似：

```nginx
location <WS_PATH> {
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Scheme $scheme;
    proxy_set_header X-Forwarded-Proto  $scheme;
    proxy_set_header X-Forwarded-For    $remote_addr;
    proxy_set_header X-Real-IP          $remote_addr;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $http_connection;
    proxy_http_version 1.1;
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
    proxy_pass http://172.17.0.1:2087;
}
```

## 9. 创建服务和用户

在 Marzneshin 中：

1. 创建 Service，例如 `<SERVICE_NAME>`。
2. 勾选刚才创建的 `vless WS` 入站。
3. 创建用户，例如 `<USERNAME>`。
4. 让用户绑定到 `<SERVICE_NAME>` 服务。

用户订阅链接形如：

```text
https://<PROXY_DOMAIN>/sub/<USERNAME>/<USER_KEY>
```

不要公开 `<USER_KEY>`。

## 10. 让 Clash / Mihomo 订阅自带分流规则

Marzneshin 支持自定义 Clash 模板，但当前版本底层的 `v2share` 会在渲染时把模板里的 `rules` 清空。所以需要一个很小的 Python 补丁，让模板里的规则能够保留下来，同时把 Marzneshin 生成的节点填入代理组。

创建目录：

```bash
mkdir -p /var/lib/marzneshin/templates
mkdir -p /var/lib/marzneshin/patches
```

写入 `/var/lib/marzneshin/patches/sitecustomize.py`：

```python
import random

import yaml

from v2share.clash import ClashConfig


PROXY_MARKER = "__MARZNESHIN_PROXIES__"


def _ordered_configs(configs, sort=True, shuffle=False):
    if shuffle:
        return random.sample(configs, len(configs))
    if sort:
        return sorted(configs, key=lambda config: config.weight)
    return configs


def _expand_group_proxies(group, remarks):
    proxies = group.get("proxies")
    if proxies == PROXY_MARKER:
        group["proxies"] = remarks
        return True

    if not isinstance(proxies, list):
        return False

    expanded = []
    found = False
    for proxy in proxies:
        if proxy == PROXY_MARKER:
            expanded.extend(remarks)
            found = True
        else:
            expanded.append(proxy)

    if found:
        group["proxies"] = expanded
    return found


def render_with_template_rules(self, sort=True, shuffle=False):
    configs = _ordered_configs(self._configs, sort=sort, shuffle=shuffle)

    proxies, remarks = [], []
    for proxy in configs:
        proxies.append(self._get_node(proxy))
        remarks.append(proxy.remark)

    result = yaml.safe_load(self.template_data) or {}
    result["proxies"] = proxies
    result.setdefault("rules", [])

    groups = result.get("proxy-groups") or []
    marker_found = False
    for group in groups:
        marker_found = _expand_group_proxies(group, remarks) or marker_found

    if groups and not marker_found:
        groups[0]["proxies"] = remarks

    return yaml.safe_dump(result, sort_keys=False, allow_unicode=True)


ClashConfig.render = render_with_template_rules
```

写入 `/var/lib/marzneshin/templates/clash.yml`。下面的模板使用自己的域名反代规则文件：

```yaml
mixed-port: 7890
allow-lan: false
mode: rule
log-level: info
ipv6: false
unified-delay: true
tcp-concurrent: true

profile:
    store-selected: true
    store-fake-ip: true

proxy-groups:
    - name: Automatic
      type: url-test
      url: http://www.gstatic.com/generate_204
      interval: 300
      tolerance: 50
      lazy: true
      proxies:
          - __MARZNESHIN_PROXIES__

    - name: Proxy
      type: select
      proxies:
          - Automatic
          - __MARZNESHIN_PROXIES__
          - DIRECT

rule-providers:
    reject:
        type: http
        behavior: domain
        format: yaml
        url: https://<PROXY_DOMAIN>/rules/reject.txt
        proxy: DIRECT
        path: ./ruleset/reject.yaml
        interval: 86400
    private:
        type: http
        behavior: domain
        format: yaml
        url: https://<PROXY_DOMAIN>/rules/private.txt
        proxy: DIRECT
        path: ./ruleset/private.yaml
        interval: 86400
    icloud:
        type: http
        behavior: domain
        format: yaml
        url: https://<PROXY_DOMAIN>/rules/icloud.txt
        proxy: DIRECT
        path: ./ruleset/icloud.yaml
        interval: 86400
    apple:
        type: http
        behavior: domain
        format: yaml
        url: https://<PROXY_DOMAIN>/rules/apple.txt
        proxy: DIRECT
        path: ./ruleset/apple.yaml
        interval: 86400
    google:
        type: http
        behavior: domain
        format: yaml
        url: https://<PROXY_DOMAIN>/rules/google.txt
        proxy: DIRECT
        path: ./ruleset/google.yaml
        interval: 86400
    proxy:
        type: http
        behavior: domain
        format: yaml
        url: https://<PROXY_DOMAIN>/rules/proxy.txt
        proxy: DIRECT
        path: ./ruleset/proxy.yaml
        interval: 86400
    direct:
        type: http
        behavior: domain
        format: yaml
        url: https://<PROXY_DOMAIN>/rules/direct.txt
        proxy: DIRECT
        path: ./ruleset/direct.yaml
        interval: 86400
    gfw:
        type: http
        behavior: domain
        format: yaml
        url: https://<PROXY_DOMAIN>/rules/gfw.txt
        proxy: DIRECT
        path: ./ruleset/gfw.yaml
        interval: 86400
    tld-not-cn:
        type: http
        behavior: domain
        format: yaml
        url: https://<PROXY_DOMAIN>/rules/tld-not-cn.txt
        proxy: DIRECT
        path: ./ruleset/tld-not-cn.yaml
        interval: 86400
    lancidr:
        type: http
        behavior: ipcidr
        format: yaml
        url: https://<PROXY_DOMAIN>/rules/lancidr.txt
        proxy: DIRECT
        path: ./ruleset/lancidr.yaml
        interval: 86400
    cncidr:
        type: http
        behavior: ipcidr
        format: yaml
        url: https://<PROXY_DOMAIN>/rules/cncidr.txt
        proxy: DIRECT
        path: ./ruleset/cncidr.yaml
        interval: 86400
    telegramcidr:
        type: http
        behavior: ipcidr
        format: yaml
        url: https://<PROXY_DOMAIN>/rules/telegramcidr.txt
        proxy: DIRECT
        path: ./ruleset/telegramcidr.yaml
        interval: 86400

rules:
    - RULE-SET,private,DIRECT
    - RULE-SET,lancidr,DIRECT,no-resolve
    - RULE-SET,reject,REJECT
    - DOMAIN-SUFFIX,openai.com,Proxy
    - DOMAIN-SUFFIX,chatgpt.com,Proxy
    - DOMAIN-SUFFIX,oaistatic.com,Proxy
    - DOMAIN-SUFFIX,oaiusercontent.com,Proxy
    - DOMAIN-SUFFIX,anthropic.com,Proxy
    - DOMAIN-SUFFIX,claude.ai,Proxy
    - RULE-SET,telegramcidr,Proxy,no-resolve
    - RULE-SET,google,Proxy
    - RULE-SET,gfw,Proxy
    - RULE-SET,proxy,Proxy
    - RULE-SET,icloud,DIRECT
    - RULE-SET,apple,DIRECT
    - RULE-SET,direct,DIRECT
    - GEOSITE,cn,DIRECT
    - GEOIP,CN,DIRECT,no-resolve
    - RULE-SET,cncidr,DIRECT,no-resolve
    - RULE-SET,tld-not-cn,Proxy
    - MATCH,Proxy
```

启用模板和补丁。编辑 `/etc/opt/marzneshin/.env`，追加：

```dotenv
CUSTOM_TEMPLATES_DIRECTORY="/var/lib/marzneshin/templates/"
CLASH_SUBSCRIPTION_TEMPLATE="/var/lib/marzneshin/templates/clash.yml"
PYTHONPATH="/var/lib/marzneshin/patches"
```

重启：

```bash
cd /etc/opt/marzneshin
docker compose up -d marzneshin
```

## 11. 修正 Clash Verge / Mihomo 的订阅识别规则

有些客户端的 User-Agent 是 `Clash-Verge/2.0`，原默认规则可能因为大小写或写法没有命中 `clash-meta`，导致回落到 classic Clash。classic Clash 不支持 VLESS，订阅里会出现 `proxies: []`。

可以在 Marzneshin 面板的订阅设置里把规则调整成：

```text
(?i)^(clash[ .-]?verge|clash[ .-]?meta|mihomo) -> clash-meta
(?i)^(clash|stash)                             -> clash
```

如果直接用命令修改 SQLite 中的订阅设置，可以执行：

```bash
docker exec marzneshin-marzneshin-1 sh -lc 'python - << "PY"
from copy import deepcopy
from sqlalchemy.orm.attributes import flag_modified
from app.db import SessionLocal
from app.db.models import Settings

session = SessionLocal()
settings = session.query(Settings).first()
subscription = deepcopy(settings.subscription)
rules = subscription.get("rules", [])

new_rules = []
inserted_meta = False
inserted_clash = False
for rule in rules:
    result = rule.get("result", "")
    if result == "clash-meta" and not inserted_meta:
        new_rules.append({"pattern": "(?i)^(clash[ .-]?verge|clash[ .-]?meta|mihomo)", "result": "clash-meta"})
        inserted_meta = True
        continue
    if result == "clash" and not inserted_clash:
        new_rules.append({"pattern": "(?i)^(clash|stash)", "result": "clash"})
        inserted_clash = True
        continue
    new_rules.append(rule)

if not inserted_meta:
    new_rules.insert(0, {"pattern": "(?i)^(clash[ .-]?verge|clash[ .-]?meta|mihomo)", "result": "clash-meta"})
if not inserted_clash:
    new_rules.insert(1, {"pattern": "(?i)^(clash|stash)", "result": "clash"})

subscription["rules"] = new_rules
settings.subscription = subscription
flag_modified(settings, "subscription")
session.commit()
print(subscription["rules"][:3])
PY'
```

## 12. 用 NPM 反代规则文件

目标是让客户端访问：

```text
https://<PROXY_DOMAIN>/rules/google.txt
```

实际由 NPM 去请求：

```text
https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt
```

这样客户端只需要能访问你的域名，不必直接访问 GitHub 或 jsDelivr。我们只放行固定规则文件名，不做开放代理。

创建 NPM 自定义配置目录：

```bash
mkdir -p /home/projects/nginx/data/nginx/custom
```

写入 `/home/projects/nginx/data/nginx/custom/server_proxy.conf`：

```nginx
location ~ ^/rules/(reject|private|icloud|apple|google|proxy|direct|gfw|tld-not-cn|lancidr|cncidr|telegramcidr)\.txt$ {
    if ($host != "<PROXY_DOMAIN>") {
        return 404;
    }

    resolver 1.1.1.1 8.8.8.8 valid=300s ipv6=off;

    set $rules_host "cdn.jsdelivr.net";
    set $rules_name $1;

    proxy_ssl_server_name on;
    proxy_ssl_name $rules_host;
    proxy_set_header Host $rules_host;
    proxy_set_header User-Agent "nginx-proxy-manager-rules-proxy";
    proxy_set_header Accept "*/*";

    proxy_buffering on;
    proxy_read_timeout 60s;
    proxy_send_timeout 60s;

    proxy_hide_header Access-Control-Allow-Origin;
    add_header Access-Control-Allow-Origin "*" always;
    add_header Cache-Control "public, max-age=3600" always;

    proxy_pass https://$rules_host/gh/Loyalsoldier/clash-rules@release/$rules_name.txt;
}
```

重要细节：文件名必须是：

```text
server_proxy.conf
```

不要命名成 `server_proxy[.]conf`。NPM 生成配置里的 `include /data/nginx/custom/server_proxy[.]conf;` 是 Nginx glob 写法，实际匹配的是 `server_proxy.conf`。

检查并 reload：

```bash
docker exec nginx-proxy-manager nginx -t
docker exec nginx-proxy-manager nginx -s reload
```

验证：

```bash
curl -ksS https://<PROXY_DOMAIN>/rules/google.txt | head
```

应该看到：

```yaml
payload:
    - ...
```

## 13. 修复订阅名称显示异常

有些客户端会把响应头：

```http
content-disposition: attachment; filename="<USERNAME>"
```

解析成奇怪的名字，比如 `\"<USERNAME>\`。可以在 NPM 同一个 `server_proxy.conf` 中继续追加：

```nginx
location ~ ^/sub/([^/]+)/[^/]+(/(sing-box|clash-meta|clash|xray|v2ray|links|wireguard))?/?$ {
    set $subscription_username $1;

    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Scheme $scheme;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_http_version 1.1;

    proxy_hide_header Content-Disposition;
    add_header Content-Disposition "attachment; filename=$subscription_username" always;

    proxy_pass http://172.17.0.1:8000;
}
```

完整的 `/home/projects/nginx/data/nginx/custom/server_proxy.conf` 应该同时包含 `/rules/` 和 `/sub/` 两段 location。

再次 reload：

```bash
docker exec nginx-proxy-manager nginx -t
docker exec nginx-proxy-manager nginx -s reload
```

验证订阅响应头：

```bash
KEY="<USER_KEY>"
curl -ksS -D - -o /dev/null -A 'Clash-Verge/2.0' "https://<PROXY_DOMAIN>/sub/<USERNAME>/$KEY"
```

应该看到：

```http
Content-Disposition: attachment; filename=<USERNAME>
```

## 14. 客户端使用方式

以 Clash Verge / Mihomo 为例：

1. 添加订阅链接：

    ```text
    https://<PROXY_DOMAIN>/sub/<USERNAME>/<USER_KEY>
    ```

2. 刷新订阅。
3. 使用 `Rule / 规则` 模式。
4. TUN 可以开启。
5. 系统代理可以不开，TUN 会接管。
6. 在代理组里，把 `Proxy` 选成 `Automatic`。

预期结果：

```text
Google / OpenAI / Telegram / GFW 列表：走代理
百度 / 国内 IP / 常见国内域名：直连
兜底 MATCH：走 Proxy
```

## 15. 验证命令

检查服务运行：

```bash
docker ps --filter name=nginx-proxy-manager
docker ps --filter name=marzneshin
```

检查监听：

```bash
ss -tulpen | grep -E '(:80 |:443 |:8000 |:2087 |:81 )'
```

理想状态：

```text
0.0.0.0:80        NPM
0.0.0.0:443       NPM
127.0.0.1:81      NPM 管理后台
172.17.0.1:8000   Marzneshin 面板
172.17.0.1:2087   Xray WS 后端
```

检查面板：

```bash
curl -ksS -o /dev/null -w '%{http_code}\n' https://<PROXY_DOMAIN>/dashboard/
```

应该返回：

```text
200
```

检查规则文件反代：

```bash
for f in google proxy direct cncidr telegramcidr; do
  printf "$f "
  curl -ksS -o /dev/null -w '%{http_code} %{size_download}\n' "https://<PROXY_DOMAIN>/rules/$f.txt"
done
```

应该都是 `200`。

检查订阅是否是 Clash Meta 且带规则：

```bash
KEY="<USER_KEY>"
curl -ksS -A 'Clash-Verge/2.0' "https://<PROXY_DOMAIN>/sub/<USERNAME>/$KEY" > /tmp/subscription.yml

grep -E '^(mode:|proxies:|proxy-groups:|rule-providers:|rules:)' /tmp/subscription.yml
grep 'type: vless' /tmp/subscription.yml
grep 'RULE-SET,google,Proxy' /tmp/subscription.yml
grep 'MATCH,Proxy' /tmp/subscription.yml
```

应该能看到：

```text
mode: rule
type: vless
RULE-SET,google,Proxy
MATCH,Proxy
```

## 16. 常见问题

### 502 Bad Gateway

最常见原因是 NPM 容器访问不到后端。

在这套方案里，不建议在 NPM 里把 Marzneshin 后端写成 `<PROXY_DOMAIN>:8000`，那会绕回公网域名，也可能形成错误转发。也不建议依赖 `host.docker.internal`，因为 NPM 生成的动态 `proxy_pass` 场景中，Nginx 的 resolver 不一定按 `/etc/hosts` 解析它。

推荐固定写：

```text
172.17.0.1:8000
172.17.0.1:2087
```

### 延迟测试正常，但 Google 打不开

这通常不是服务器节点问题，而是客户端分流规则问题。

如果全局模式可以打开 Google，规则模式打不开，说明订阅没有正确带规则，或者规则源下载失败。检查：

```bash
curl -ksS https://<PROXY_DOMAIN>/rules/google.txt | head
```

以及客户端里规则源是否更新成功。

### 订阅里 `proxies: []`

大概率是客户端 User-Agent 没匹配到 `clash-meta`，回落到了 classic Clash。VLESS 需要 Clash Meta / Mihomo。检查订阅规则：

```text
(?i)^(clash[ .-]?verge|clash[ .-]?meta|mihomo) -> clash-meta
```

### NPM 自定义配置不生效

确认文件名：

```bash
ls -l /home/projects/nginx/data/nginx/custom/server_proxy.conf
```

然后：

```bash
docker exec nginx-proxy-manager nginx -T | grep -n 'location ~ \^/rules' -A 30
```

如果看不到 `/rules/` location，说明 include 没匹配到。

### 升级 Marzneshin 后订阅规则丢失

本文的补丁通过：

```dotenv
PYTHONPATH="/var/lib/marzneshin/patches"
```

挂载在 `/var/lib/marzneshin`，不会因为容器重建丢失。但如果 Marzneshin 后续底层生成逻辑变动，建议升级后重新验证：

```bash
curl -ksS -A 'Clash-Verge/2.0' "https://<PROXY_DOMAIN>/sub/<USERNAME>/<USER_KEY>" | grep -E 'RULE-SET|type: vless|mode: rule'
```

## 17. 当前最终文件清单

```text
/etc/opt/marzneshin/docker-compose.yml
/etc/opt/marzneshin/.env
/var/lib/marzneshin/templates/clash.yml
/var/lib/marzneshin/patches/sitecustomize.py
/home/projects/nginx/docker-compose.yml
/home/projects/nginx/data/nginx/custom/server_proxy.conf
```

最终公网只需要开放：

```text
80/tcp
443/tcp
22/tcp  # SSH，建议限制来源 IP 或改用密钥
```

## 18. 参考资料

- [Marzneshin 官方基础安装文档](https://docs.marzneshin.org/docs/getting-started/basic-install/)
- [Marzneshin 官方 Nginx 反代文档](https://docs.marzneshin.org/docs/how-to-guides/behind-nginx/)
- [Docker Compose 官方文档](https://docs.docker.com/compose/)
- [Loyalsoldier Clash 规则](https://github.com/Loyalsoldier/clash-rules)
