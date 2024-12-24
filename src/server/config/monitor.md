# 监控配置

WuKongIM 支持 prometheus 监控，可以通过配置文件或者环境变量来配置 prometheus 的地址。


## `prometheus` 配置

在`prometheus` 配置`WuKongIM`的 prometheus 的地址, 例如：

```yaml

global:
  scrape_interval:     15s 
  evaluation_interval: 15s 
scrape_configs:
  - job_name: wukongim1-trace-metrics
    static_configs:
    - targets: ['node1.example.local:5300']
      labels:
        id: "1"
  - job_name: wukongim2-trace-metrics
    static_configs:
    - targets: ['node2.example.local:5300']
      labels:
        id: "2"
  - job_name: wukongim3-trace-metrics
    static_configs:
    - targets: ['node3.example.local:5300']
      labels:
        id: "3"

```

job_name: 监控名字 建议命名规则为 wukongim[节点Id]-trace-metrics

targets:  `WuKongIM`的 prometheus 监控地址  例如：`xxx.xxx.xxx.xxx:5300`

labels:  id 为节点Id


## `WuKongIM` 配置

在`WuKongIM`配置文件中配置 prometheus 的地址, 例如：

```yaml

trace: # 数据追踪
    prometheusApiUrl: "http://xx.xx.xx.xx:9090" # prometheus的内网地址,用于获取监控数据

```