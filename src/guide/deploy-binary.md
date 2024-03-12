
# 执行文件部署（推荐）

## 1. 下载二进制包

下载对应您系统的二进制包 [release](https://github.com/WuKongIM/WuKongIM/releases/latest) 

(国内可以通过gitee下载 https://gitee.com/WuKongDev/WuKongIM/releases/latest)

`
amd架构的系统比较多，所以不清楚下载那个的话 先下载amd后缀的包试试,Windows系统的包仅测试使用，不建议在生产环境使用
`

## 2. 执行

将下载的文件重命名为 wukongim

设置可执行权限

```shell

chmod +x wukongim

```

启动wukongim

```shell

./wukongim 

```

或者指定配置

```shell

./wukongim --config configs/config.yaml

```

后台启动

```shell

./wukongim  -d

```

停止服务

```shell

./wukongim  stop

```




## 3. 配置

[部署配置](/guide/deploy-config)