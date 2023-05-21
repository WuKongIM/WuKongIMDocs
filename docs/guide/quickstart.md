---
title: 部署
group:
  title: 快速开始
  order: -1
order: 100
---

# 部署

## 一键部署（推荐）

```shell

sudo curl -L "https://github.com/WuKongIM/WuKongIMCli/releases/download/v1.0.0/wukongimcli-$(uname -s)-$(uname -m)" -o /usr/local/bin/wk
sudo chmod +x /usr/local/bin/wk
# 启动
wk start

# 停止
# wk stop

```

## 源码部署

```shell

git clone https://github.com/WuKongIM/WuKongIM.git
cd WuKongIM
go build -o wkim main.go
# 启动
./wkim

```

## Docker 部署

```shell
docker run -p 7676:7676 -p 2122:2122 -p 1516:1516  --name wukongim -v ./wukongimdata:/home/wukongimdata  wukongim/wukongim:latest
```

## Docker Compose 部署

```shell

git clone https://github.com/WuKongIM/WuKongIM.git
cd WuKongIM
docker-compose up -d

```

## 配置

配置文件为当前目录下的 wk.yaml（默认为~/wukongimdata/wk.yaml）文件，如果没有此文件，则使用系统的默认最优配置。

完整配置请查看[完整配置](/guide/fullconfig)

## 验证部署

```shell

sudo curl -L "https://github.com/WuKongIM/WuKongIMCli/releases/download/v1.0.0/wukongimcli-$(uname -s)-$(uname -m)" -o /usr/local/bin/wk
sudo chmod +x /usr/local/bin/wk
wk doctor

```

```
HTTP listener 1516 port is ok
TCP listener 7676 port is ok
Websocket listener 2122 port is ok
MQTT listener 5255 port is ok

```
