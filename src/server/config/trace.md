# 轨迹日志配置

消息轨迹是通过收集日志发给`Loki`来分析的，所以需要配置`Loki`的地址

```yaml

logger:
  traceOn: true # 开启轨迹日志 
  loki:
    url: "http://xxx.xxx.xxx.xxx:3100" # loki服务的地址

```

