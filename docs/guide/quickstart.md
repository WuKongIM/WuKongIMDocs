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
curl -sSL https://raw.githubusercontent.com/WuKongIM/WuKongIMCli/main/install.sh | sh -s v1.0.3
# 运行
wk run

# 后台启动
# wk start

# 停止
# wk stop

```

## Docker 部署

```shell
docker run -p 5000:5000 -p 5100:5100 -p 5200:5200 -p 5300:5300  --name wukongim -v ./wukongim:/root/wukongim  wukongim/wukongim:latest
```

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
