# 多节点扩容


## 说明

适用场景：对数据安全要求高的应用，大型应用。

优点：高可用，容灾性强，支持在线扩容，多副本之间实时自动备份，负载均衡, 无需手动配置, 快速伸缩

缺点：需要多台机器。


#### 1. 扩容
```bash
# 可选参数 
# 1.副本数量 replicaCount=1 默认为2
# 2.外部IP externalIP=
helm upgrade wkim wukongim/wukongim -n wukomgim --create-namespace --version 0.1.0 --set replicaCount=3
```