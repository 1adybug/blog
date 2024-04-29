---
slug: use-baidu-in-leaflet
title: 在 leaflet 中使用百度地图瓦片图
authors: [1adybug]
date: 2024-04-26
tags: [leaflet, 百度, 百度地图, 地图, 瓦片图]
---

## 安装

安装 `leaflet`, `proj4`, `proj4leaflet`：

```shell
yarn add leaflet proj4 proj4leaflet
yarn add @types/leaflet @types/proj4 @types/proj4leaflet -D
```

## 使用

```TypeScript
import L from "leaflet"
import "proj4leaflet"
import "leaflet/dist/leaflet.css"
import "./style.css"

const resolutions = Array(20)
    .fill(0)
    .map((_, i) => Math.pow(2, 18 - i))

const baiduCrs = new L.Proj.CRS('EPSG:900913', '+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs', {
    resolutions,
    origin: [0, 0],
    bounds: L.bounds([20037508.342789244, 0], [-20037508.342789244, 20037508.342789244])
})

const map = new L.Map(document.getElementById("app")!, {
    center: [33.60478, 119.05186],
    zoom: 19,
    crs: baiduCrs,
    minZoom: 3,
    // 必须设置最大缩放为 19
    maxZoom: 19
})

L.tileLayer("/wanda-baidu/{z}/{x}/{y}.png", {
    tms: true,
    attribution: 'Map data &copy; <a href="https://map.baidu.com/">百度地图</a>',
    minZoom: 3,
    // 必须设置最大缩放为 19
    maxZoom: 19
}).addTo(map)

L.marker([33.60503, 119.045273]).addTo(map)
```
