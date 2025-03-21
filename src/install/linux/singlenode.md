# 单节点模式

## 说明

适用场景：小型应用，对数据安全要求不高的应用，后续量大可以扩容成集群。

优点：部署简单，性能较好，支持在线扩容。

缺点：无法容灾，需要手动备份。

## 环境要求

- Linux系统（推荐Ubuntu）(推荐配置 2核4G或4核8G)


## 安装

1. 下载执行文件

::: code-group

``` bash [amd64]
curl -L -o wukongim https://github.com/WuKongIM/WuKongIM/releases/download/v2.1.2-20250120/wukongim-linux-amd64
```

``` bash [arm64]
curl -L -o wukongim https://github.com/WuKongIM/WuKongIM/releases/download/v2.1.2-20250120/wukongim-linux-arm64
```

:::

2. 修改执行文件权限

``` bash
chmod +x wukongim
```


3. 创建配置文件`wk.yaml` 内容如下：

```yaml
mode: "release"
rootDir: "./wukongim_data"
cluster:
  nodeId: 1001 # 节点id
  serverAddr: "xx.xx.xx.xx:11110" # 节点内部通信请求地址
external: # 公网配置
  ip: "xx.xx.xx.xx" # 节点外网IP，客户端能够访问到的IP地址。
```

`ip修改为服务器的外网IP地址`

`serverAddr的xx.xx.xx.xx修改为服务器的内网IP地址`

4. 启动或停止

``` bash

# 启动 （-d表示后台运行，否则是前台运行）

./wukongim --config wk.yaml -d

# 停止

./wukongim stop

```



## 开放端口

| 端口 | 说明 |
| --- | --- |
| 5001 | http api 端口 (仅内部局域网开放) |
| 5100 | tcp 端口 ， app端需要能访问到 |
| 5200 | websocket 端口 ， web im端需要能访问到 |
| 5300 | 后台管理系统的端口， 访问地址: http://xx.xx.xx.xx:5300/web |
| 5172 | demo的端口，用于演示wukongim通讯能力的demo 访问地址: http://127.0.0.1:5172/chatdemo |


## 验证

1. 访问`http://127.0.0.1:5172/chatdemo`，随便输入用户名和密码，登录后可以聊天，说明部署成功。