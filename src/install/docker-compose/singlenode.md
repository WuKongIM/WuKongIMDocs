
# 单节点模式

## 说明

适用场景：小型应用，对数据安全要求不高的应用，后续量大可以扩容成集群。

优点：部署简单，性能较好，支持在线扩容。

缺点：无法容灾，需要手动备份。

## 环境要求

- Linux系统（推荐Ubuntu）(推荐配置 2核4G或4核8G)

- 安装Docker (推荐：Docker版本24.0.4或以上)


## 安装


#### 1. 创建安装目录


创建目录

```bash

mkdir  ~/wukongim
```


进入目录

```bash

cd  ~/wukongim

```

#### 2. 在安装目录创建`docker-compose.yml`文件

内容如下：

```yaml
version: '3.7'
services:
  wukongim: # WuKongIM服务
    image: registry.cn-shanghai.aliyuncs.com/wukongim/wukongim:v2
    environment:
      - "WK_CLUSTER_NODEID=1001"  
      - "WK_CLUSTER_SERVERADDR=xx.xx.xx.xx:11110" # 节点内部通信请求地址
      - "WK_TRACE_PROMETHEUSAPIURL=http://prometheus:9090" # prometheus监控地址
      - "WK_MODE=release" # release模式
      - "WK_EXTERNAL_IP=xxx.xxx.xxx.xxx" # 服务器外网ip
      - "WK_CLUSTER_APIURL=http://xx.xxx.xxx.xx:5001" # api的内网地址
      - "WK_INTRANET_TCPADDR=xx.xx.xxx.xx:5100" # tcp连接的内网地址，此配置主要用于压测
    healthcheck:
      test: "wget -q -Y off -O /dev/null http://localhost:5001/health > /dev/null 2>&1"
      interval: 10s
      timeout: 10s
      retries: 3       
    restart: always  
    volumes:
      - ./wukongim_data:/root/wukongim # 数据挂载到物理机的目录
    ports:
      - 5001:5001 # http api 端口
      - 5100:5100 # tcp端口
      - 5200:5200 # websocket端口
      - 5300:5300 # 管理端端口
      - 5172:5172 # demo端口
      - 11110:11110 # 分布式节点通讯端口
  prometheus:  # 监控服务
    image: registry.cn-shanghai.aliyuncs.com/wukongim/prometheus:v2.53.1
    volumes:
      - "./prometheus.yml:/etc/prometheus/prometheus.yml"
    ports:
      - "9090:9090"      
```

注意：`WK_EXTERNAL_IP` xx.xx.xx.xx修改为自己服务器的外网ip地址

`WK_CLUSTER_SERVERADDR` xx.xx.xx.xx修改为自己服务器的内网ip地址


## 配置

#### 配置`prometheus.yml`文件

在安装目录创建`prometheus.yml`文件，内容如下：

```yaml
global:
  scrape_interval:     10s 
  evaluation_interval: 10s 
scrape_configs:
  - job_name: wukongim1-trace-metrics
    static_configs:
    - targets: ['wukongim:5300']
      labels:
        id: "1001"

```



## 启动或停止

#### 1. 启动

```bash

sudo docker-compose up -d

```

#### 2. 停止

```bash

sudo docker-compose stop

```



## 开放端口

| 端口 | 说明 |
| --- | --- |
| 5001 | http api 端口 (仅内部局域网开放) |
| 5100 | tcp 端口 ， app端需要能访问到 |
| 5200 | websocket 端口 ， web im端需要能访问到 |
| 5300 | 后台管理系统的端口， 访问地址: http://xx.xx.xx.xx:5300/web |
| 5172 | demo的端口，用于演示wukongim通讯能力的demo 访问地址: http://xx.xx.xx.xx.1:5172 |


## 验证

1. 访问`http://xx.xx.xx.xx:5172`，随便输入用户名和密码，登录后可以聊天，说明部署成功。

2. 访问 ` http://xx.xx.xx.xx:5300/web` 可以进入后台管理系统 默认系统内置的guest只有读权限，如果需要操作权限，请看[授权的配置](/server/config/auth) 。