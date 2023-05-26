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
curl -sSL https://raw.githubusercontent.com/WuKongIM/WuKongIMCli/main/install.sh | sh -s v1.0.1
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
docker run -p 5000:5000 -p 5100:5100 -p 5200:5200 -p 5300:5300  --name wukongim -v ./wukongimdata:/root/wukongimdata  wukongim/wukongim:latest
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
(更多版本进入https://github.com/WuKongIM/WuKongIMCli/releases/download下载)
sudo curl -L "https://github.com/WuKongIM/WuKongIMCli/releases/download/v1.0.1/wukongimcli-$(uname -s)-$(uname -m)" -o /usr/local/bin/wk
sudo chmod +x /usr/local/bin/wk
wk doctor

```

```
HTTP listener 5000 port is ok
TCP listener 5100 port is ok
Websocket listener 5200 port is ok
Monitor listener 5300 port is ok

```
