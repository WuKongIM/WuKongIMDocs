
# 单节点模式扩容

## 说明

原先部署的[单节点模式](singlenode.md)，现在要扩容成多台服务器，这里以两台服务器为例，说明如何扩容。

假设有两台服务器，信息如下

| 名称 | 内网IP | 外网IP | 描述 |
| --- | --- | --- | --- | 
| node1(1001) | 192.168.1.10 | 221.123.68.10 | 主节点（原部署好的单机节点） |
| node2(1002) | 192.168.1.20 | 221.123.68.20 |  即将加入的新节点 |


node1 是原先部署好的单机节点，现在要扩容成两台服务器，node2 是新加入的节点。

`注意：以下文件内容都以假设的服务器的ip设置的，只需要将对应的ip更换成自己的即可`


## node2上部署`WuKongIM`

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

内容如下（`注意将对应的ip替换成自己的`）：

```yaml

version: '3.7'
services:
  wukongim: # WuKongIM服务
    image: registry.cn-shanghai.aliyuncs.com/wukongim/wukongim:v2
    environment:
      - "WK_MODE=release" # release模式
      - "WK_CLUSTER_NODEID=1002" 
      - "WK_EXTERNAL_IP=221.123.68.20" # 服务器外网ip
      - "WK_EXTERNAL_WSADDR=ws://221.123.68.10:15200"  # web端访问的ws长连接地址，注意这里是 node1的外网ip
      - "WK_EXTERNAL_TCPADDR=221.123.68.10:15100"  # app端访问的tcp长连接地址,注意这里是 node1的外网ip
      - "WK_CLUSTER_APIURL=http://192.168.1.20:5001" # 节点内部通信api url地址，这里ip换成自己节点实际node2的内网ip  
      - "WK_CLUSTER_SERVERADDR=192.168.1.20:11110" # 节点内部通信请求地址
      - "WK_CLUSTER_SEED=1001@192.168.1.10:11110" # 种子节点， 原集群里任意节点都可以做为种子节点，这里将node1节点作为种子节点
      - "WK_TRACE_PROMETHEUSAPIURL=http://192.168.1.10:9090" # prometheus监控地址， node1的内网地址
    healthcheck:
      test: "wget -q -Y off -O /dev/null http://localhost:5001/health > /dev/null 2>&1"
      interval: 10s
      timeout: 10s
      retries: 3       
    restart: always  
    volumes:
      - ./wukongim_data:/root/wukongim # 数据挂载到物理机的目录
    ports:
      - 11110:11110 # 分布式节点通讯端口
      - 5001:5001 # 内网api通讯端口
      - 5100:5100 # tcp端口
      - 5200:5200 # websocket端口
      - 5300:5300 # 管理端端口

```



## 调整node1原来的`docker-compose.yml`文件配置

在`wukongim1`服务下新增如下内容

```yaml
  wukongim1: 
    ...
    environment:
      - "WK_EXTERNAL_WSADDR=ws://221.123.68.10:15200"  # web端访问的ws长连接地址,这里使用负载均衡的地址
      - "WK_EXTERNAL_TCPADDR=221.123.68.10:15100"  # app端访问的tcp长连接地址，这里使用负载均衡的地址
      - "WK_CLUSTER_APIURL=http://192.168.1.10:5001" # 节点内部api url地址，这里ip换成自己节点实际node1的内网ip  
      - "WK_CLUSTER_SERVERADDR=192.168.1.10:11110" # 节点内部通信请求地址
    ...
```




## 部署负载均衡 `nginx`

在`node1`上的`docker-compose.yml`文件中新增如下内容

```yaml
  nginx:
    image: registry.cn-shanghai.aliyuncs.com/wukongim/nginx:1.27.0
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "15001:5001"
      - "15100:5100"
      - "15200:5200"
      - "15300:5300"
      - "15172:5172" 

```

在`node1`的安装目录下新建`nginx.conf`文件，内容如下

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;


    # api负载均衡
    upstream wukongimapi {
        server 192.168.1.10:5001;
        server 192.168.1.20:5001;
    }
    # demo负载均衡
    upstream wukongimdemo {
        server 192.168.1.10:5172;
        server 192.168.1.20:5172;
    }
    # manager负载均衡
    upstream wukongimanager {
        server 192.168.1.10:5300;
        server 192.168.1.20:5300;
    }
    # ws负载均衡
    upstream wukongimws {
        server 192.168.1.10:5200;
        server 192.168.1.20:5200;
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
            rewrite ^ /chatdemo?apiurl=http://221.123.68.10:15001;
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
}

# tcp
stream {
  # tcp负载均衡
  upstream wukongimtcp {
    server 192.168.1.10:5100;
    server 192.168.1.20:5100;
  }
  server {
    listen 5100;
    proxy_connect_timeout 4s;
    proxy_timeout 120s;
    proxy_pass wukongimtcp;
  }
}

```

## 将新节点纳入监控`prometheus.yml`

修改node1节点的`prometheus.yml`文件，完整内容如下：

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
  - job_name: wukongim2-trace-metrics
    static_configs:
    - targets: ['192.168.1.20:5300']
      labels:
        id: "1002"      


```


## 启动和停止

在各自节点安装目录下执行以下命令

#### 启动

```bash

sudo docker-compose up -d

```

#### 停止

```bash 

sudo docker-compose stop

```




## 开放端口

#### 外网开放

| 端口 | 说明 |
| --- | --- |
| 15001 | http api 端口 (仅内部局域网开放) |
| 15100 | tcp 端口 ， app端需要能访问到 |
| 15200 | websocket 端口 ， web im端需要能访问到 |
| 15300 | 后台管理系统的端口|
| 15172 | demo的端口，用于演示wukongim通讯能力的demo |

#### 内网开放(需要节点之间能访问到)

| 端口 | 说明 |
| --- | --- |
| 5001 | http api 端口 (仅内部局域网开放) |
| 5100 | tcp 端口 ， 分布式情况下只需内网开放 |
| 5200 | websocket 端口 ，分布式情况下只需内网开放 web im端需要能访问到 |
| 5300 | 后台管理系统的端口|


## 验证

登录后台管理系统，在节点管理中可以看到新加入的节点的状态是否是`已加入`状态，如果是则说明扩容成功。