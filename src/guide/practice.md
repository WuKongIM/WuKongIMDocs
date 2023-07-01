# 最佳实践

最佳实践为按照正式环境要求进行部署和配置。

## 部署

### 安装
```shell

curl -sSL https://gitee.com/WuKongDev/WuKongIMCli/raw/main/install.sh | sudo bash

```

### 运行

```shell
wk start
```

首次start会下载服务器文件，下载完毕就好了。

### 配置

编辑 `~/wukongim/wk.yaml` 文件，内容如下

```yaml

mode: 'release' # 正式环境建议为release
tokenAuthOn: true # 长连接开启token认证
wsAddr: "" # ws 监听地址，正式环境建议使用wss，所以这里ws设置为空
wssAddr: "wss://0.0.0.0:5210" # wss 监听地址
wssConfig: 
  certFile: "/root/wukong/cert.crt" # wss证书文件绝对路径 (更换为自己的证书)
  keyFile: "/root/wukong/key.key" # wss证书key文件绝对路径 (更换为自己的证书)
demo:
  on: false # 关闭demo
external:
  ip: 'xxx.xxx.xxxx.xxx' # 外网IP

```

### 端口

内网放行，外网屏蔽的端口：
```shell

5001 # http api端口，（保证您自己的业务服务能访问到）
5300 # 监控管理端端口

```

外网放行端口

```shell
5100 # tcp长连接端口
5210 # wss长连接端口
```

### 重启

```shell

wk restart

```

# 未完待续