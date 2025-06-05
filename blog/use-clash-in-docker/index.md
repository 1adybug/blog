---
slug: use-clash-in-docker
title: 在 Docker 中使用 Clash
authors: [1adybug]
date: 2025-06-05
tags: [docker, clash, mihomo]
---

在图形化的操作系统中，我们可以使用 `Clash Verge` 来使用代理，但是在服务器上，就没有这么方便了。这时候我们可以使用 `Clash` 的核心 `mihomo` 来实现代理。然而，`mihomo` 的安装也是比较麻烦，所以我们可以使用 `Docker` 来安装 `mihomo`。

## 安装教程

1. 安装 Docker
2. 创建 `config.yaml` 文件

    ```yaml
    # url 里填写自己的订阅,名称不能重复
    proxy-providers:
        <你的订阅名称>:
            url: "<你的订阅链接>"
            type: http
            interval: 86400
            health-check: { enable: true, url: "https://www.gstatic.com/generate_204", interval: 300 }

    proxies:
        - name: "直连"
        type: direct
        udp: true

    mixed-port: 7890
    ipv6: true
    allow-lan: true
    unified-delay: false
    tcp-concurrent: true
    external-controller: 0.0.0.0:9090
    external-ui: ui
    external-ui-url: "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip"
    # 如果你的端口开放了所有 IP 访问，建议取消注释 secret 并设置密码
    # secret: <你的密码>

    geodata-mode: true
    geox-url:
        geoip: "https://mirror.ghproxy.com/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip-lite.dat"
        geosite: "https://mirror.ghproxy.com/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat"
        mmdb: "https://mirror.ghproxy.com/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country-lite.mmdb"
        asn: "https://mirror.ghproxy.com/https://github.com/xishang0128/geoip/releases/download/latest/GeoLite2-ASN.mmdb"

    find-process-mode: strict
    global-client-fingerprint: chrome

    profile:
        store-selected: true
        store-fake-ip: true

    sniffer:
        enable: true
        sniff:
            HTTP:
                ports: [80, 8080-8880]
                override-destination: true
            TLS:
                ports: [443, 8443]
            QUIC:
                ports: [443, 8443]
        skip-domain:
            - "Mijia Cloud"
            - "+.push.apple.com"

    tun:
        enable: true
        stack: mixed
        dns-hijack:
            - "any:53"
            - "tcp://any:53"
        auto-route: true
        auto-redirect: true
        auto-detect-interface: true

    dns:
        enable: true
        ipv6: true
        enhanced-mode: fake-ip
        fake-ip-filter:
            - "*"
            - "+.lan"
            - "+.local"
            - "+.market.xiaomi.com"
        default-nameserver:
            - tls://223.5.5.5
            - tls://223.6.6.6
        nameserver:
            - https://doh.pub/dns-query
            - https://dns.alidns.com/dns-query

    proxy-groups:
        - name: 默认
        type: select
        proxies: [自动选择, 直连, 香港, 台湾, 日本, 新加坡, 美国, 其它地区, 全部节点]

        - name: Google
        type: select
        proxies: [默认, 香港, 台湾, 日本, 新加坡, 美国, 其它地区, 全部节点, 自动选择, 直连]

        - name: Telegram
        type: select
        proxies: [默认, 香港, 台湾, 日本, 新加坡, 美国, 其它地区, 全部节点, 自动选择, 直连]

        - name: Twitter
        type: select
        proxies: [默认, 香港, 台湾, 日本, 新加坡, 美国, 其它地区, 全部节点, 自动选择, 直连]

        - name: 哔哩哔哩
        type: select
        proxies: [默认, 香港, 台湾, 日本, 新加坡, 美国, 其它地区, 全部节点, 自动选择, 直连]

        - name: 巴哈姆特
        type: select
        proxies: [默认, 香港, 台湾, 日本, 新加坡, 美国, 其它地区, 全部节点, 自动选择, 直连]

        - name: YouTube
        type: select
        proxies: [默认, 香港, 台湾, 日本, 新加坡, 美国, 其它地区, 全部节点, 自动选择, 直连]

        - name: NETFLIX
        type: select
        proxies: [默认, 香港, 台湾, 日本, 新加坡, 美国, 其它地区, 全部节点, 自动选择, 直连]

        - name: Spotify
        type: select
        proxies: [默认, 香港, 台湾, 日本, 新加坡, 美国, 其它地区, 全部节点, 自动选择, 直连]

        - name: Github
        type: select
        proxies: [默认, 香港, 台湾, 日本, 新加坡, 美国, 其它地区, 全部节点, 自动选择, 直连]

        - name: 国内
        type: select
        proxies: [直连, 默认, 香港, 台湾, 日本, 新加坡, 美国, 其它地区, 全部节点, 自动选择]

        - name: 其他
        type: select
        proxies: [默认, 香港, 台湾, 日本, 新加坡, 美国, 其它地区, 全部节点, 自动选择, 直连]

        #分隔,下面是地区分组
        - name: 香港
        type: select
        include-all: true
        exclude-type: direct
        filter: "(?i)港|hk|hongkong|hong kong"

        - name: 台湾
        type: select
        include-all: true
        exclude-type: direct
        filter: "(?i)台|tw|taiwan"

        - name: 日本
        type: select
        include-all: true
        exclude-type: direct
        filter: "(?i)日|jp|japan"

        - name: 美国
        type: select
        include-all: true
        exclude-type: direct
        filter: "(?i)美|us|unitedstates|united states"

        - name: 新加坡
        type: select
        include-all: true
        exclude-type: direct
        filter: "(?i)(新|sg|singapore)"

        - name: 其它地区
        type: select
        include-all: true
        exclude-type: direct
        filter: "(?i)^(?!.*(?:🇭🇰|🇯🇵|🇺🇸|🇸🇬|🇨🇳|港|hk|hongkong|台|tw|taiwan|日|jp|japan|新|sg|singapore|美|us|unitedstates)).*"

        - name: 全部节点
        type: select
        include-all: true
        exclude-type: direct

        - name: 自动选择
        type: url-test
        include-all: true
        exclude-type: direct
        tolerance: 10

    rules:
        - GEOIP,lan,直连,no-resolve
        - GEOSITE,github,Github
        - GEOSITE,twitter,Twitter
        - GEOSITE,youtube,YouTube
        - GEOSITE,google,Google
        - GEOSITE,telegram,Telegram
        - GEOSITE,netflix,NETFLIX
        - GEOSITE,bilibili,哔哩哔哩
        - GEOSITE,bahamut,巴哈姆特
        - GEOSITE,spotify,Spotify
        - GEOSITE,CN,国内
        - GEOSITE,geolocation-!cn,其他

        - GEOIP,google,Google
        - GEOIP,netflix,NETFLIX
        - GEOIP,telegram,Telegram
        - GEOIP,twitter,Twitter
        - GEOIP,CN,国内
        - MATCH,其他
    ```

3. 创建 `docker-compose.yaml` 文件

    ```yaml
    version: "3"

    services:
        metacubexd:
            container_name: metacubexd
            image: ghcr.io/metacubex/metacubexd
            restart: always
            ports:
                - "9097:80"

        mihomo:
            container_name: mihomo
            image: docker.io/metacubex/mihomo:latest
            restart: always
            ports:
                # 尽量使用 127.0.0.1 而不是 0.0.0.0，否则可能让代理暴露在公网
                - "127.0.0.1:7890:7890"
                - "9090:9090"
            volumes:
                - <保存 config.yaml 文件的目录>:/root/.config/mihomo
    ```

4. 启动容器 `docker compose up -d`

## 使用教程

在需要使用代理的地方，设置代理为 `http://127.0.0.1:7890` 即可。

比如为终端设置代理：

1. 编辑 `~/.bashrc` 文件，添加以下内容：

    ```bash
    export http_proxy="http://127.0.0.1:7890"
    export https_proxy="http://127.0.0.1:7890"
    export all_proxy="socks5://127.0.0.1:7890"
    export no_proxy="localhost,127.0.0.1,*.local"
    ```

2. 保存并退出，然后执行 `source ~/.bashrc` 使配置生效。
3. 使用 `curl https://www.google.com` 测试是否成功。

## 注意事项

1. 尽量不要使用 `MobaXterm` 等终端创建或者编辑配置文件，可以会出现默认编码非 `UTF-8` 或者缺少字符集的问题，导致配置文件无法正常使用。
2. `config.yaml` 中 `external-controller` 的端口和 `docker-compose.yaml` 中 `metacubexd` 的端口都需要在防火墙中开放，建议只允许特定 IP 访问，如果全放开的话，建议取消注释 `secret` 并设置密码。
3. `docker-compose.yaml` 中 `mihomo` 的 `volumes` 需要指向 `config.yaml` 文件在主机的目录而非文件。
4. 如果 `mihomo` 的容器的日志中出现了下载文件的错误，请到 [meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat) 仓库中手动下载文件并保存到 `config.yaml` 所在的目录
