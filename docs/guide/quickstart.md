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
curl -sSL https://raw.githubusercontent.com/WuKongIM/WuKongIMCli/main/install.sh | sh -s v1.0.5
```

或国内

```shell
curl -sSL https://raw.githubusercontent.com/install.sh | sh -s v1.0.5
```

```shell
# 运行
wk run

# 后台启动
# wk start

# 停止
# wk stop

```

`-s后的版本号可以视情况设置`

## Docker 部署

```shell
docker run -d -p 5000:5000 -p 5100:5100 -p 5200:5200 -p 5300:5300 -e WK_EXTERNAL_IP=xxx.xxx.xxx.xx  --name wukongim -v ~/wukongim:/root/wukongim  wukongim/wukongim:latest

```

`WK_EXTERNAL_IP：为服务器外网IP，用于客户端连接，如果仅测试，客户端和服务器都在一个局域网内，这里可以填部署服务器的局域网IP`

查看服务器信息： http://127.0.0.1:5000/varz

端口解释：

5000: http api 端口

5100: app 长连接的 tcp 端口

5200: websocket 端口，web 或 pc 长连接使用的

5300: 监控端口，可以查看服务的运行状态

## Docker Compose 部署

```shell

git clone https://github.com/WuKongIM/WuKongIM.git
cd WuKongIM
docker-compose up -d

```

## 配置

配置文件为当前目录下的 wk.yaml（默认为~/wukongim/wk.yaml）文件，如果没有此文件，则使用系统的默认最优配置。

完整配置请查看[完整配置](/guide/fullconfig)

## 验证部署

```shell
wk doctor
```

```shell
[✓] Http Service is running in 5000
[✓] TCP Service is running in 5100
[✓] Monitor Service is running in 5300
• No issues found!
```
