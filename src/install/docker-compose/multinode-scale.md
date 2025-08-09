
# 多节点扩容模式

## 说明

原先按照[多节点模式](multinode.md)的方式部署的节点，可以通过增加节点的方式扩展集群规模。本文档介绍如何通过增加节点的方式扩展集群规模。

假设新增加的节点信息如下：

| 名称 | 内网IP | 外网IP |
| --- | --- | --- | 
| node4(1004) | 10.206.0.6 | 146.56.232.98 | 


## 在node4上部署`WuKongIM`

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


```yaml
version: '3.7'
services:
  wukongim: # WuKongIM服务
    image: registry.cn-shanghai.aliyuncs.com/wukongim/wukongim:v2
    environment:
      - "WK_CLUSTER_NODEID=1004" 
      # - "WK_TOKENAUTHON=true"  # 开启token认证，生产环境强烈建议开启
      - "WK_CLUSTER_APIURL=http://10.206.0.6:5001" # 节点内部通信api url地址，这里ip换成自己节点实际node2的内网ip  
      - "WK_CLUSTER_SERVERADDR=10.206.0.6:11110" # 节点内部通信请求地址
      - "WK_EXTERNAL_WSADDR=ws://119.45.229.172:15200"  # web端访问的ws长连接地址
      - "WK_EXTERNAL_TCPADDR=119.45.229.172:15100"  # app端访问的tcp长连接地址
      - "WK_TRACE_PROMETHEUSAPIURL=http://10.206.0.13:9090" # 监控地址
      - "WK_CLUSTER_SEED=1001@10.206.0.13:11110" # 种子节点， 原集群里任意节点都可以做为种子节点，这里将node1节点作为种子节点
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

#### 3. 配置监控

再原先的`node1`节点上的安装目录（`~/wukongim`）里的`prometheus.yml`文件的`scrape_configs`内容下新增如下内容：

```yaml
scrape_configs:
    ...
    - job_name: 'wukongim4-trace-metrics'
        static_configs:
        - targets: ['10.206.0.6:5300']
          labels:
            id: "1003"

```

#### 4. 配置负载均衡

在`gateway`节点上的安装目录（`~/gateway`）里的`nginx.conf`文件的所有upstream下新增如下内容：


```nginx

upstream wukongimapi {
    ...
    server 10.206.0.6:5001;
}

upstream wukongimdemo {
    ...
    server 10.206.0.6:5172;
}

upstream wukongimanager {
    ...
    server 10.206.0.6:5300;
}
upstream wukongimws {
    ...
    server 10.206.0.6:5200;
}


stream {
  ...
  upstream wukongimtcp {
      ...
      server 10.206.0.6:5100;
  }
...

}



```


#### 5. 重启node1

在node1进入安装目录（`~/wukongim`）里执行如下命令：

```bash

sudo docker-compose restart

```

#### 6. 启动node4

在`node4`进入安装目录（`~/wukongim`）里执行如下命令：

```bash

sudo docker-compose up -d

```


## 验证

登录后台管理系统，在节点管理中可以看到新加入的节点的状态是否是已加入状态，如果是则说明扩容成功。

