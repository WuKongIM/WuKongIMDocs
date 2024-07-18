# 多节点模式

## 说明

适用场景：对数据安全要求高的应用，大型应用。

优点：高可用，容灾性强，支持在线扩容，多副本之间实时自动备份，负载均衡等。

缺点：部署稍复杂，需要多台机器。

WuKongIM集群符合 `2n+1` 原则，n表示宕机数量，比如允许1台机器宕机不影响服务正常运行则需要2\*1+1=3台机器的集群，比如允许2台机器宕机不影响服务正常运行则需要2\*2+1=5台机器的集群，依次类推。

## 环境要求

- 机器数量：3台或以上

- Linux系统（推荐Ubuntu）(推荐配置 2核4G或4核8G)

- 安装Docker (推荐：Docker版本24.0.4或以上)

假设三台服务器，信息如下

| 名称 | 内网IP | 外网IP | 角色 |   
| --- | --- | --- | --- |
| node1(1001) | 192.168.12.1 | 222.222.222.1 | 核心节点 |
| node2(1002) | 192.168.12.2 | 222.222.222.2 | 常规 |
| node3(1003) | 192.168.12.3 | 222.222.222.3 |  常规 |

## 准备工作

需要在`node1`节点上部署`nginx`推荐版本1.27.0，用于负载均衡。

## 安装

1. 下载执行文件

范围：所有节点

::: code-group

``` bash [amd64]
curl -L -o wukongim https://github.com/WuKongIM/WuKongIM/releases/download/v2.0.1-beta-20240715/wukongim-linux-amd64
```

``` bash [arm64]
curl -L -o wukongim https://github.com/WuKongIM/WuKongIM/releases/download/v2.0.1-beta-20240715/wukongim-linux-arm64
```

:::


2. 修改执行文件权限

范围：所有节点

``` bash
chmod +x wukongim
```

## 配置

#### 配置`WuKongIM`

在node1上创建配置文件`wk.yaml` 内容如下：

```yaml
mode: "release"
external: # 公网配置
  ip: "222.222.222.1" # 节点外网IP，客户端能够访问到的IP地址。
  tcpAddr: "222.222.222.1:15100" #  app访问的长连接地址, 注意这里是负载均衡服务器的ip和端口，不是本机的
  wsAddr: "ws://222.222.222.1:15200" #  web访问的长连接地址，注意这里是负载均衡服务器的ip和端口，不是本机的
cluster:
  nodeId: 1001 # 节点id
  apiUrl: "http://192.168.12.1:5001" # 当前节点内网的api地址
  serverAddr: "192.168.12.1:11110" # 当前节点内网的分布式通讯地址
  nodes: 
    - "1001@192.168.12.1:11100"
    - "1002@192.168.12.2:11100"
    - "1003@192.168.12.3:11100"
```


在node2上创建配置文件`wk.yaml` 内容如下：

```yaml
mode: "release"
external: # 公网配置
  ip: "222.222.222.2" # 节点外网IP，客户端能够访问到的IP地址。
  tcpAddr: "222.222.222.1:15100" #  app访问的长连接地址, 注意这里是负载均衡服务器的ip和端口，不是本机的
  wsAddr: "ws://222.222.222.1:15200" #  web访问的长连接地址，注意这里是负载均衡服务器的ip和端口，不是本机的
cluster:
  nodeId: 1002 # 节点id
  apiUrl: "http://192.168.12.2:5001" # 当前节点内网的api地址
  serverAddr: "192.168.12.2:11110" # 当前节点内网的分布式通讯地址
  nodes: 
    - "1001@192.168.12.1:11100"
    - "1002@192.168.12.2:11100"
    - "1003@192.168.12.3:11100"
```



在node3上创建配置文件`wk.yaml` 内容如下：

```yaml
mode: "release"
external: # 公网配置
  ip: "222.222.222.3" # 节点外网IP，客户端能够访问到的IP地址。
  tcpAddr: "222.222.222.1:15100" #  app访问的长连接地址, 注意这里是负载均衡服务器的ip和端口，不是本机的
  wsAddr: "ws://222.222.222.1:15200" #  web访问的长连接地址，注意这里是负载均衡服务器的ip和端口，不是本机的
cluster:
  nodeId: 1003 # 节点id
  apiUrl: "http://192.168.12.3:5001" # 当前节点内网的api地址
  serverAddr: "192.168.12.3:11110" # 当前节点内网的分布式通讯地址
  nodes: 
    - "1001@192.168.12.1:11100"
    - "1002@192.168.12.2:11100"
    - "1003@192.168.12.3:11100"
```

#### 配置`nginx`

```nginx
# api负载均衡
upstream wukongimapi {
    server 192.168.12.1:5001;
    server 192.168.12.2:5001;
    server 192.168.12.3:5001;
}
# demo负载均衡
upstream wukongimdemo {
    server 192.168.12.1:5172;
    server 192.168.12.2:5172;
    server 192.168.12.3:5172;
}
# manager负载均衡
upstream wukongimanager {
    server 192.168.12.1:5300;
    server 192.168.12.2:5300;
    server 192.168.12.3:5300;
}
# ws负载均衡
upstream wukongimws {
    server 192.168.12.1:5200;
    server 192.168.12.2:5200;
    server 192.168.12.3:5200;
}
# tcp负载均衡
upstream wukongimtcp {
    server 192.168.12.1:5100;
    server 192.168.12.2:5100;
    server 192.168.12.3:5100;
}
# http api转发
server {
    listen 5001;
    location / {
        proxy_pass http://wukongimapi;
        proxy_connect_timeout 20s;
        proxy_read_timeout 60s;
    }
}
# demo
server {
    listen 5172;
    location / {
        proxy_pass http://wukongimdemo;
        proxy_connect_timeout 20s;
        proxy_read_timeout 60s;
    }
    location /login {
        rewrite ^ /chatdemo?apiurl=http://222.222.222.1:15001;
        proxy_pass http://wukongimdemo;
        proxy_connect_timeout 20s;
        proxy_read_timeout 60s;
    }
}
# manager
server {
    listen 5300;
    location / {
        proxy_pass http://wukongimanager;
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }
}
# ws
server {
    listen 5200;
    location / {
        proxy_pass http://wukongimws;
        proxy_redirect off;
	    proxy_http_version 1.1;
        # nginx接收upstream server数据超时, 默认120s, 如果连续的120s内没有收到1个字节, 连接关闭
	    proxy_read_timeout 120s;
        # nginx发送数据至upstream server超时, 默认120s, 如果连续的120s内没有发送1个字节, 连接关闭
        proxy_send_timeout 120s; 
        # nginx与upstream server的连接超时时间
        proxy_connect_timeout 4s; 
        proxy_set_header  X-Real-IP $remote_addr;
	    proxy_set_header Upgrade $http_upgrade;
	    proxy_set_header Connection "upgrade";
    }
}
# tcp
server {
    listen: 5100;
    proxy_connect_timeout 4s;
    proxy_timeout 120s;
    proxy_pass wukongimtcp;
}
```
`记得重启nginx生效`

## 启动或停止

所有节点启动WuKongIM

``` bash

./wukongim --config wk.yaml -d

# 停止
# ./wukongim stop

```


## 开放端口

| 端口 | 说明 |
| --- | --- |
| 15001 | http api 端口 (仅内部局域网开放) |
| 15100 | tcp 端口 ， app端需要能访问到 |
| 15200 | websocket 端口 ， web im端需要能访问到 |
| 15300 | 后台管理系统的端口， 访问地址: http://127.0.0.1:5300/web |
| 15172 | demo的端口，用于演示wukongim通讯能力的demo 访问地址: http://127.0.0.1:15172/login |


## 验证

1. 访问`http://222.222.222.1:15172/login`，随便输入用户名和密码，登录后可以聊天，说明部署成功。