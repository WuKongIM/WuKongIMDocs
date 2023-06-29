# 部署

## 一键部署（推荐）

```shell
curl -sSL https://gitee.com/WuKongDev/WuKongIMCli/raw/main/install.sh | sudo bash
```

```shell

# 前台运行
wk run


# 后台启动
# wk start


# 停止
# wk stop

# 升级WuKongIM
# wk upgrade

```

配置文件在 `~/wukongim/wk.yaml` .

默认是局域网地址，如果需要外网访问，需要修改配置文件中的 `external.ip` 为服务器外网 IP。如下

```yaml
external:
  ip: 'xxx.xxx.xxxx.xxx'
```

## Docker 部署

```shell
docker run -d -p 5001:5001 -p 5100:5100 -p 5172:5172 -p 5200:5200 -p 5300:5300 -e WK_EXTERNAL_IP=xxx.xxx.xxx.xx  --name wukongim -v ~/wukongim:/root/wukongim  wukongim/wukongim:latest

```

（如果慢镜像可以替换为国内的： registry.cn-shanghai.aliyuncs.com/wukongim/wukongim:latest）

`WK_EXTERNAL_IP：为服务器外网IP，用于客户端连接，如果仅测试，客户端和服务器都在一个局域网内，这里可以填部署服务器的局域网IP`

## Docker Compose 部署

```shell

git clone https://github.com/WuKongIM/WuKongIM.git
cd WuKongIM
docker-compose up -d

```

`WK_EXTERNAL_IP：为服务器外网IP，用于客户端连接，如果仅测试，客户端和服务器都在一个局域网内，这里可以填部署服务器的局域网IP`

## 配置

配置文件为当前目录下的 wk.yaml（默认为~/wukongim/wk.yaml）文件，如果没有此文件，则使用系统的默认最优配置。

完整配置请查看[完整配置](/guide/fullconfig)

## 端口说明

5001: http api 端口

5100: app 长连接的 tcp 端口

5172: demo端口，用于测试

5200: websocket 端口，web 或 pc 长连接使用的

5300: 监控端口，可以查看服务的运行状态（待完善）

查看服务器信息： http://127.0.0.1:5001/varz

查看监控系统： http://127.0.0.1:5300/web

chat demo： http://127.0.0.1:5172/chatdemo

## 验证部署

```shell
wk doctor
```

```shell
[✓] Http Service is running in 5001
[✓] TCP Service is running in 5100
[✓] Monitor Service is running in 5300
• No issues found!
```
