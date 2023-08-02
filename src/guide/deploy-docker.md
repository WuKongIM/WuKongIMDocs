# Docker 部署


## 部署

启动服务

```shell
docker run -d -p 5001:5001 -p 5100:5100 -p 5172:5172 -p 5200:5200 -p 5300:5300  --name wukongim -v ~/wukongim:/root/wukongim  wukongim/wukongim:latest

```

`（如果慢镜像可以替换为国内的： registry.cn-shanghai.aliyuncs.com/wukongim/wukongim:latest）`

重启服务

```shell

docker stop wukongim

```

```shell
docker start wukongim
```



## 配置

[部署配置](/guide/deploy-config)