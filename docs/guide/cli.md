---
group:
  title: 进阶
  order: 300
order: 300
title: 命令行工具
---

# 命令行工具

## 安装命令行工具

```shell
curl -sSL https://gitee.com/WuKongDev/WuKongIMCli/raw/main/install.sh | sudo bash
```

## context 命令

配置服务端信息

```shell
wk context add demo --server http://127.0.0.1:5001 --token xxxx --description "WuKongIM Demo"
```

--server: 为部署的`悟空IM`服务器地址，默认端口 5001
--token: 为`悟空IM`服务器的 token，默认为空

## run 命令

前端启动服务

```shell
wk run
```

## start 命令

后台启动服务

```shell
wk start
```

## stop 命令

停止后台服务

```shell
wk stop
```

## doctor 命令

检测服务是否正常

```shell
wk doctor
```

## upgrade 命令

升级`悟空IM`端（在部署了服务器的机器上运行才有效）

```shell
wk upgrade
```

## top 命令

查看服务器状态

```shell
wk top
```

结果

```
 WuKongIM server version v1.0.9 (uptime: 1h47m58s)
 Server:
   Load: CPU:  23.0%  Memory: 35.9M  Slow Consumers: 0
   In:   Msgs: 44.9K  Bytes: 12.1M  Msgs/Sec: 5833.7  Bytes/Sec: 1.5M
   Out:  Msgs: 44.9K  Bytes: 853.9K  Msgs/Sec: 5833.7  Bytes/Sec: 108.2K

 Connections Polled: 10
   HOST                   ID     UID                   CLIENTS  PENDING     MSGS_TO     MSGS_FROM   BYTES_TO    BYTES_FROM  DEVICE_ID   DEVICE   VERSION  UPTIME   LAST_ACTIVITY
   122.238.90.130:2449    6      188cddb93e6-0-0       0       0           4.2K        4.2K        80.6K       1.1M        00f843-c5f6f2  App(从)   5        9s       2023-06-18
 17:35:09.383624811 +0800 CST
   122.238.90.130:2450    7      188cddb93e6-1-10001   0       0           4.8K        4.8K        92.0K       1.3M        98420d-767a22  App(从)   5        9s       2023-06-18
 17:35:09.284453739 +0800 CST
   122.238.90.130:2451    8      188cddb93e6-2-20002   0       0           4.1K        4.1K        77.5K       1.1M        ab865e-5a7b10  App(从)   5        9s       2023-06-18
 17:35:09.38275954 +0800 CST
   122.238.90.130:2452    9      188cddb93e6-3-30003   0       0           3.8K        3.8K        71.5K       1.0M        5a7a11-b8903f  App(从)   5        9s       2023-06-18
 17:35:09.259002566 +0800 CST
   122.238.90.130:2453    10     188cddb93e6-4-40004   0       0           4.9K        4.9K        93.8K       1.3M        8b7973-03ca81  App(从)   5        9s       2023-06-18
```

## bench 命令

压力测试命令

```
wk bench [ChannelID] --pub 1 --msgs 100000
```

ChannelID: 频道 ID（类型默认为群组）

--pub: 发布者数量

--msgs: 发布消息总数量

参考结果：

```
2023/06/19 12:58:42 Get the tcp address of a test user
2023/06/19 12:58:42 Starting WuKongIM  pub/sub benchmark [msgSize=128 B]
2023/06/19 12:58:42 Starting pub, sending 100,000 messages
Finished      0s [=======================================================================================================================] 100%

Pub stats: 163,936 msgs/sec ~ 20.01 MB/sec
```
