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

`xx.xx.xx.xx` 替换为`WuKongIM`的`内网ip`地址

`xxxx` 替换为`WuKongIM`的`nodeId`

## 配置`WuKongIM`

在各节点的`wk.yaml`文件中配置`prometheus`的地址

```yaml

trace:
  prometheusApiUrl: "http://xx.xx.xx.xx:9090"

```

`xx.xx.xx.xx`替换为`prometheus`的`内网ip`地址