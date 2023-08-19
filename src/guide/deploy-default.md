# 一键部署（推荐）

## 部署

安装部署脚本

```shell
curl -sSL https://gitee.com/WuKongDev/WuKongIMCli/raw/main/install.sh | sudo bash
```

开始服务

```shell

wk start

```

重启服务

```shell

wk stop

```

```shell

wk start

```

`wk stop如果有报错可以忽略`


## 配置

[部署配置](/guide/deploy-config)

## 验证


```shell
wk doctor
```

```shell
[✓] Http Service is running in 5001
[✓] TCP Service is running in 5100
[✓] Monitor Service is running in 5300
• No issues found!
```
