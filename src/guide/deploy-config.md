# 部署配置

`配置修改需要重启服务，重启服务方式查看对应的部署方式的章节`

## 1. 配置IP地址

配置文件在 `~/wukongim/wk.yaml` （如果没有就新建）

需要修改配置文件中的 `external.ip` 为服务器外网 IP（如果本地电脑部署没有外网IP，可填写本机局域网IP）。如下

```yaml
external:
  ip: 'xxx.xxx.xxx.xxx'
```


[完整配置说明](/guide/fullconfig)

## 2. 开放端口


5001: http api 端口

5100: app 长连接的 tcp 端口

5172: demo端口，用于测试

5200: websocket 端口，web 或 pc 长连接使用的

5300: 监控端口，可以查看服务的运行状态（待完善）

查看服务器信息： http://127.0.0.1:5001/varz

查看监控系统： http://127.0.0.1:5300/web

chat demo： http://127.0.0.1:5172/chatdemo