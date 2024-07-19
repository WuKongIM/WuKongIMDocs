
# 单机模式扩容

## 说明

原先部署的[单节点模式](singlenode.md)，现在要扩容成多台服务器，这里以两台服务器为例，说明如何扩容。

假设有两台服务器，信息如下

| 名称 | 内网IP | 外网IP | 角色 |
| --- | --- | --- | --- | 
| node1(1001) | 192.168.1.10 | 221.123.68.10 | 主节点（原部署好的单机节点） |
| node2(1002) | 192.168.1.20 | 221.123.68.20 |  即将加入的新节点 |


node1 是原先部署好的单机节点，现在要扩容成两台服务器，node2 是新加入的节点。

`注意：以下文件内容都以假设的服务器的ip设置的，只需要将对应的ip更换成自己的即可`


## 准备工作

需要在node1节点上部署`nginx`推荐版本1.27.0，用于负载均衡。

## 部署`WuKongIM`

在node2节点上部署`WuKongIM`，流程跟单节点模式一样，这里不再赘述，具体：

部署WuKongIM教程参考[单节点模式](singlenode.md)。

## 配置`WuKongIM`

修改node2节点的配置文件`wk.yaml`，完整内容如下：

```yaml
mode: "release"
external: # 公网配置
  ip: "221.123.68.20" # 节点外网IP，客户端能够访问到的IP地址。
  tcpAddr: "221.123.68.10:15100" #  app访问的长连接地址, 注意这里是负载均衡服务器的ip和端口，不是本机的
  wsAddr: "ws://221.123.68.10:15200" #  web访问的长连接地址，注意这里是负载均衡服务器的ip和端口，不是本机的
cluster:
  nodeId: 1002 # 节点id
  apiUrl: "http://192.168.1.20:5001" # 当前节点内网的api地址
  serverAddr: "192.168.1.20:11110" # 当前节点内网的分布式通讯地址
  seed: "1001@192.168.1.10:11110"  # 种子节点， 原节点的地址
```


修改node1节点的配置文件`wk.yaml`，完整内容如下：

```yaml

mode: "release"
external: # 公网配置
  ip: "221.123.68.10" # 节点外网IP，客户端能够访问到的IP地址。
  tcpAddr: "221.123.68.10:15100" #  app访问的长连接地址, 注意这里是负载均衡服务器的ip和端口
  wsAddr: "ws://221.123.68.10:15200" #  web访问的长连接地址，注意这里是负载均衡服务器的ip和端口
cluster:
  nodeId: 1001 # 节点id
  apiUrl: "http://192.168.1.10:5001" # 当前节点内网的api地址
  serverAddr: "192.168.1.10:11110" # 当前节点内网的分布式通讯地址
```


## 配置`nginx`

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

## 重启

最后重启node1的nginx和node1，node2上的wukongim即可。


## 验证

登录后台管理系统，在节点管理中可以看到新加入的节点的状态是否是已加入状态，如果是则说明扩容成功。