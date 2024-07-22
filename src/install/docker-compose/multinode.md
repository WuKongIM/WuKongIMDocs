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

| 名称 | 内网IP | 外网IP | 
| --- | --- | --- | 
| node1(1001) | 10.206.0.13 | 119.45.229.172 | 
| node2(1002) | 10.206.0.14 | 129.211.213.76 | 
| node3(1003) | 10.206.0.8  | 1.13.191.138 | 


## 安装

#### 1. 创建安装目录（`所有节点`）

在所有节点创建目录


```bash
mkdir  ~/wukongim
```




#### 2. 在安装目录创建docker-compose.yml文件 

在`node1`节点上的安装目录（`~/wukongim`）里创建`docker-compose.yml`文件，内容如下：

```yaml
version: '3.7'
services:
  wukongim: # WuKongIM服务
    image: registry.cn-shanghai.aliyuncs.com/wukongim/wukongim:v2.0.1-beta-20240715
    environment:
      - "WK_MODE=release" # release模式
      - "WK_CLUSTER_NODEID=1001" 
      - "WK_EXTERNAL_IP=119.45.229.172"  # 当前节点外网ip
      - "WK_CLUSTER_APIURL=http://10.206.0.13:5001" # 节点内部通信api url地址，这里ip换成自己节点实际node2的内网ip  
      - "WK_CLUSTER_SERVERADDR=10.206.0.13:11110" # 节点内部通信请求地址
      - "WK_EXTERNAL_WSADDR=ws://119.45.229.172:15200"  # web端访问的ws长连接地址，这里设置负载均衡的地址即可，这样让负载均衡来分配WuKongIM
      - "WK_EXTERNAL_TCPADDR=119.45.229.172:15100"  # app端访问的tcp长连接地址，这里设置负载均衡的地址即可，这样让负载均衡来分配WuKongIM
      - "WK_TRACE_PROMETHEUSAPIURL=http://10.206.0.13:9090" # 监控地址
      - "WK_CLUSTER_INITNODES=1001@10.206.0.13 1002@10.206.0.14 1003@10.206.0.8" # 集群节点列表
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
      - 5172:5172 # demo端口
  prometheus:  # 监控服务
    image: registry.cn-shanghai.aliyuncs.com/wukongim/prometheus:v2.53.1
    volumes:
      - "./prometheus.yml:/etc/prometheus/prometheus.yml"
    ports:
      - "9090:9090"
  nginx:  # 负载均衡
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



在`node2`节点上的安装目录（`~/wukongim`）里创建`docker-compose.yml`文件，内容如下：

```yaml
version: '3.7'
services:
  wukongim: # WuKongIM服务
    image: registry.cn-shanghai.aliyuncs.com/wukongim/wukongim:v2.0.1-beta-20240715
    environment:
      - "WK_MODE=release" # release模式
      - "WK_CLUSTER_NODEID=1002" 
      - "WK_EXTERNAL_IP=129.211.213.76"  # 当前节点外网ip
      - "WK_CLUSTER_APIURL=http://10.206.0.14:5001" # 节点内部通信api url地址，这里ip换成自己节点实际node2的内网ip  
      - "WK_CLUSTER_SERVERADDR=10.206.0.14:11110" # 节点内部通信请求地址
      - "WK_EXTERNAL_WSADDR=ws://129.211.213.76:15200"  # web端访问的ws长连接地址
      - "WK_EXTERNAL_TCPADDR=129.211.213.76:15100"  # app端访问的tcp长连接地址
      - "WK_TRACE_PROMETHEUSAPIURL=http://10.206.0.13:9090" # 监控地址
      - "WK_CLUSTER_INITNODES=1001@10.206.0.13 1002@10.206.0.14 1003@10.206.0.8" # 集群节点列表
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
      - 5172:5172 # demo端口

```




在`node3`节点上的安装目录（`~/wukongim`）里创建`docker-compose.yml`文件，内容如下：

```yaml
version: '3.7'
services:
  wukongim: # WuKongIM服务
    image: registry.cn-shanghai.aliyuncs.com/wukongim/wukongim:v2.0.1-beta-20240715
    environment:
      - "WK_MODE=release" # release模式
      - "WK_CLUSTER_NODEID=1003" 
      - "WK_EXTERNAL_IP=1.13.191.138"  # 当前节点外网ip
      - "WK_CLUSTER_APIURL=http://10.206.0.8:5001" # 节点内部通信api url地址，这里ip换成自己节点实际node2的内网ip  
      - "WK_CLUSTER_SERVERADDR=10.206.0.8:11110" # 节点内部通信请求地址
      - "WK_EXTERNAL_WSADDR=ws://119.45.229.172:15200"  # web端访问的ws长连接地址
      - "WK_EXTERNAL_TCPADDR=119.45.229.172:15100"  # app端访问的tcp长连接地址
      - "WK_TRACE_PROMETHEUSAPIURL=http://10.206.0.13:9090" # 监控地址
      - "WK_CLUSTER_INITNODES=1001@10.206.0.13 1002@10.206.0.14 1003@10.206.0.8" # 集群节点列表
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
      - 5172:5172 # demo端口

```

#### 3. 配置监控（`node1`节点）

在node1节点上的安装目录（`~/wukongim`）里创建`prometheus.yml`文件，内容如下：

```yaml
global:
  scrape_interval:     15s 
  evaluation_interval: 15s 
scrape_configs:
  - job_name: wukongim1-trace-metrics
    static_configs:
    - targets: ['10.206.0.13:5300']
      labels:
        id: "1001"
  - job_name: wukongim2-trace-metrics
    static_configs:
    - targets: ['10.206.0.14:5300']
      labels:
        id: "1002"
  - job_name: wukongim3-trace-metrics
    static_configs:
    - targets: ['10.206.0.8:5300']
      labels:
        id: "1003"      
```



#### 4. 配置负载均衡（`node1`节点）

在node1节点上的安装目录（`~/wukongim`）里创建`nginx.conf`文件，内容如下：

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
        server 10.206.0.13:5001;
        server 10.206.0.14:5001;
        server 10.206.0.8:5001;
    }
    # demo负载均衡
    upstream wukongimdemo {
        server 10.206.0.13:5172;
        server 10.206.0.14:5172;
        server 10.206.0.8:5172;
    }
    # manager负载均衡
    upstream wukongimanager {
        server 10.206.0.13:5300;
        server 10.206.0.14:5300;
        server 10.206.0.8:5300;
    }
    # ws负载均衡
    upstream wukongimws {
        server 10.206.0.13:5200;
        server 10.206.0.14:5200;
        server 10.206.0.8:5200;
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
            rewrite ^ /chatdemo?apiurl=http://119.45.229.172:15001;
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
    server 10.206.0.13:5100;
    server 10.206.0.14:5100;
    server 10.206.0.8:5100;
  }
  server {
    listen 5100;
    proxy_connect_timeout 4s;
    proxy_timeout 120s;
    proxy_pass wukongimtcp;
  }
}

```


## 启动

在所有节点下执行如下命令

```bash
sudo docker-compose up -d
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

1. 访问`http://119.45.229.172:15172/login`，随便输入用户名和密码，登录后可以聊天，说明部署成功。

2. 访问 ` http://119.45.229.172:15300/web` 可以进入后台管理系统 默认系统内置的guest只有读权限，如果需要操作权限，请看[授权的配置](/server/config/auth) 。