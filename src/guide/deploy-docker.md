# Docker 部署


## 部署

启动服务

```shell
docker run -d -p 5001:5001 -p 5100:5100 -p 5172:5172 -p 5200:5200 -p 5210:5210 -p 5300:5300  --name wukongim -v ～/wukongim:/root/wukongim  registry.cn-shanghai.aliyuncs.com/wukongim/wukongim:v1.2

```

新建配置文件

```shell

vi ~/wukongim/wk.yaml

```

参考： [部署配置](/guide/deploy-config)




重启服务

```shell
docker stop wukongim
```

```shell
docker start wukongim
```



## 配置

[部署配置](/guide/deploy-config)
