# 多节点模式

## 说明

适用场景：对数据安全要求高的应用，大型应用。

优点：高可用，容灾性强，支持在线扩容，多副本之间实时自动备份，负载均衡等。

缺点：部署稍复杂，需要多台机器。

WuKongIM集群符合 `2n+1` 原则，n表示宕机数量，比如允许1台机器宕机不影响服务正常运行则需要2\*1+1=3台机器的集群，比如允许2台机器宕机不影响服务正常运行则需要2\*2+1=5台机器的集群，依次类推。

## 环境要求

- 机器数量：4台或以上

- Linux系统（推荐Ubuntu）(推荐配置 2核4G或4核8G)

- 安装Docker (推荐：Docker版本24.0.4或以上)

假设三台服务器，信息如下

| 角色 | 说明 | 内网IP | 外网IP | 
| --- | ---  | --- | --- | 
| 负载均衡和监控 | gateway | 10.206.0.2  | 119.45.33.109 | 
| WuKongIM节点 |node1(ID: 1) | 10.206.0.10 | 146.56.249.208 | 
| WuKongIM节点 |node2(ID: 2) | 10.206.0.12 | 129.211.171.99 | 
| WuKongIM节点 |node3(ID: 3) | 10.206.0.5  | 119.45.175.82 | 


## 安装负载均衡和监控

#### 1. 创建安装目录（`gateway`）

在`gateway`节点创建目录

```bash
mkdir  ~/gateway
```

#### 2. 在安装目录创建docker-compose.yml文件

在`gateway`节点的安装目录（`~/gateway`）里创建`docker-compose.yml`文件，内容如下：

```yaml

version: '3.7'
services:
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
      - "15001:15001"
      - "15100:15100"
      - "15200:15200"
      - "15300:15300"
      - "15172:15172" 


```

#### 3. 配置负载均衡

在`gateway`节点的安装目录（`~/gateway`）里创建`nginx.conf`文件，内容如下：

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
    keepalive_timeout  65;

    # api负载均衡
    upstream wukongimapi {
        server 10.206.0.10:5001;
        server 10.206.0.12:5001;
        server 10.206.0.5:5001;
    }
    # demo负载均衡
    upstream wukongimdemo {
        server 10.206.0.10:5172;
        server 10.206.0.12:5172;
        server 10.206.0.5:5172;
    }
    # manager负载均衡
    upstream wukongimanager {
        server 10.206.0.10:5300;
        server 10.206.0.12:5300;
        server 10.206.0.5:5300;
    }
    # ws负载均衡
    upstream wukongimws {
        server 10.206.0.10:5200;
        server 10.206.0.12:5200;
        server 10.206.0.5:5200;
    }
    # http api转发
    server {
        listen 15001;
        location / {
            proxy_pass http://wukongimapi;
            proxy_connect_timeout 20s;
            proxy_read_timeout 60s;
        }
    }
    # demo
    server {
        listen 15172;
        location / {
            proxy_pass http://wukongimdemo;
            proxy_connect_timeout 20s;
            proxy_read_timeout 60s;
        }
        location /login {
            rewrite ^ /chatdemo?apiurl=http://119.45.33.109:15001;
            proxy_pass http://wukongimdemo;
            proxy_connect_timeout 20s;
            proxy_read_timeout 60s;
        }
    }
    # manager
    server {
        listen 15300;
        location / {
            proxy_pass http://wukongimanager;
            proxy_connect_timeout 60s;
            proxy_read_timeout 60s;
        }
    }
    # ws
    server {
        listen 15200;
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
    server 10.206.0.10:5100;
    server 10.206.0.12:5100;
    server 10.206.0.5:5100;
  }
  server {
    listen 15100;
    proxy_connect_timeout 4s;
    proxy_timeout 120s;
    proxy_pass wukongimtcp;
  }
}

```

#### 4. 配置监控

在`gateway`节点的安装目录（`~/gateway`）里创建`prometheus.yml`文件，内容如下：

```yaml
global:
  scrape_interval:     15s 
  evaluation_interval: 15s 
scrape_configs:
  - job_name: wukongim1-trace-metrics
    static_configs:
    - targets: ['10.206.0.10:5300']
      labels:
        id: "1"
  - job_name: wukongim2-trace-metrics
    static_configs:
    - targets: ['10.206.0.12:5300']
      labels:
        id: "2"
  - job_name: wukongim3-trace-metrics
    static_configs:
    - targets: ['10.206.0.5:5300']
      labels:
        id: "3"

```


## 安装WuKongIM节点

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
    image: registry.cn-shanghai.aliyuncs.com/wukongim/wukongim:v2
    environment:
      - "WK_MODE=release" # release模式
      - "WK_CLUSTER_NODEID=1"   # 节点id不能大于等于1024
      - "WK_EXTERNAL_IP=146.56.249.208"  # 当前节点外网ip
      - "WK_CLUSTER_APIURL=http://10.206.0.10:5001" # 节点内部通信api url地址，这里ip换成自己节点实际的内网ip  
      - "WK_CLUSTER_SERVERADDR=10.206.0.10:11110" # 节点内部通信请求地址
      - "WK_EXTERNAL_WSADDR=ws://119.45.33.109:15200"  # web端访问的ws长连接地址，这里设置负载均衡的地址即可，这样让负载均衡来分配WuKongIM节点
      - "WK_EXTERNAL_TCPADDR=119.45.33.109:15100"  # app端访问的tcp长连接地址，这里设置负载均衡的地址即可，这样让负载均衡来分配WuKongIM节点
      - "WK_TRACE_PROMETHEUSAPIURL=http://10.206.0.2:9090" # 监控内网地址
      - "WK_CLUSTER_INITNODES=1@10.206.0.10 2@10.206.0.12 3@10.206.0.5" # 集群初始节点列表
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



在`node2`节点上的安装目录（`~/wukongim`）里创建`docker-compose.yml`文件，内容如下：

```yaml
version: '3.7'
services:
  wukongim: # WuKongIM服务
    image: registry.cn-shanghai.aliyuncs.com/wukongim/wukongim:v2
    environment:
      - "WK_MODE=release" 
      - "WK_CLUSTER_NODEID=2" 
      - "WK_EXTERNAL_IP=129.211.171.99"  
      - "WK_CLUSTER_APIURL=http://10.206.0.12:5001"
      - "WK_CLUSTER_SERVERADDR=10.206.0.12:11110" 
      - "WK_EXTERNAL_WSADDR=ws://119.45.33.109:15200"  
      - "WK_EXTERNAL_TCPADDR=119.45.33.109:15100"  
      - "WK_TRACE_PROMETHEUSAPIURL=http://10.206.0.2:9090" 
      - "WK_CLUSTER_INITNODES=1@10.206.0.10 2@10.206.0.12 3@10.206.0.5" # 集群节点列表
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
    image: registry.cn-shanghai.aliyuncs.com/wukongim/wukongim:v2
    environment:
      - "WK_MODE=release"
      - "WK_CLUSTER_NODEID=3" 
      - "WK_EXTERNAL_IP=119.45.175.82" 
      - "WK_CLUSTER_APIURL=http://10.206.0.5:5001"
      - "WK_CLUSTER_SERVERADDR=10.206.0.5:11110" 
      - "WK_EXTERNAL_WSADDR=ws://119.45.33.109:15200"  
      - "WK_EXTERNAL_TCPADDR=119.45.33.109:15100"  
      - "WK_TRACE_PROMETHEUSAPIURL=http://10.206.0.2:9090" 
      - "WK_CLUSTER_INITNODES=1@10.206.0.10 2@10.206.0.12 3@10.206.0.5" 
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


## 启动

在所有`WuKongIM`节点和`gateway`的安装目录下执行如下命令启动服务

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

1. 访问`http://119.45.33.109:15172/login`，随便输入用户名和密码，登录后可以聊天，说明部署成功。

2. 访问 ` http://119.45.33.109:15300/web` 可以进入后台管理系统 默认系统内置的guest只有读权限，如果需要操作权限，请看[授权的配置](/server/config/auth) 。