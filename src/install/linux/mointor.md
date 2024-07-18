# 监控


## 准备工作

安装[prometheus](https://github.com/prometheus/prometheus)


## 配置`prometheus`

在`scrape_configs`节点下新增`WuKongIM`的监控项目

job_name: 唯一job名字

targets: 为`WuKongIM`的`内网ip` + 5300端口

labels: id为`WuKongIM`的`nodeId`


```yaml
...
scrape_configs:
  ...
  - job_name: xxxx-trace-metrics
    static_configs:
    - targets: ['xx.xx.xx.xx:5300']
      labels:
        id: "xxxx"
 ...


```