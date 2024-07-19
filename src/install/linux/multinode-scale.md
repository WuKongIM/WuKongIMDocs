
# 多节点扩容模式

## 说明

原先按照[多节点模式](multinode.md)的方式部署的节点，可以通过增加节点的方式扩展集群规模。本文档介绍如何通过增加节点的方式扩展集群规模。

假设新增加的节点信息如下：

| 名称 | 内网IP | 外网IP |
| --- | --- | --- | 
| node4(1004) | 192.168.12.4 | 222.222.222.4 | 



## 安装`WuKongIM`

在node4节点上

1. 下载执行文件

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

在node4上创建配置文件`wk.yaml` 内容如下：

```yaml

mode: "release"
external: # 公网配置
  ip: "222.222.222.4" # 节点外网IP，客户端能够访问到的IP地址。
  tcpAddr: "222.222.222.1:15100" #  app访问的长连接地址, 注意这里是负载均衡服务器的ip和端口，不是本机的
  wsAddr: "ws://222.222.222.1:15200" #  web访问的长连接地址，注意这里是负载均衡服务器的ip和端口，不是本机的
cluster:
  nodeId: 1004 # 节点id
  apiUrl: "http://192.168.12.4:5001" # 当前节点内网的api地址
  serverAddr: "192.168.12.4:11110" # 当前节点内网的分布式通讯地址
  seed: "1001@192.168.12.1:11100" # 种子节点

```

#### 配置`nginx`

在原先node1节点上配置nginx，增加node4节点的负载均衡配置。

```nginx
upstream wukongimapi {
    ...
    server 192.168.12.4:5001;
}

upstream wukongimdemo {
    ...
    server 192.168.12.4:5172;
}

upstream wukongimanager {
    ...
    server 192.168.12.4:5300;
}
upstream wukongimws {
    ...
    server 192.168.12.4:5200;
}

stream {
  ...
  upstream wukongimtcp {
      ...
     server 192.168.12.4:5100;
  }
...

}
```

`记得重启nginx让配置生效`

## 启动`WuKongIM`

``` bash

./wukongim --config wk.yaml -d

```


## 验证

登录后台管理系统，在节点管理中可以看到新加入的节点的状态是否是已加入状态，如果是则说明扩容成功。