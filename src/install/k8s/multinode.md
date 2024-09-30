# 多节点点部署


## 说明

适用场景：对数据安全要求高的应用，大型应用。

优点：高可用，容灾性强，支持在线扩容，多副本之间实时自动备份，负载均衡, 无需手动配置, 快速伸缩

缺点：需要多台机器。


#### 1. 添加Helm仓库
```bash
helm repo add wukongim https://wukongim.github.io/helm/
```

#### 2. 更新Helm仓库
```bash
helm repo update
```

#### 3. 搜索可用的 Chart
```bash
helm search repo wukongim
```

#### 4. 部署
```bash
# 可选参数 
# 1.副本数量 replicaCount=1 默认为2
# 2.外部IP externalIP=
helm install wkim wukongim/wukongim -n wukomgim --create-namespace --version 0.1.0 --set replicaCount=3
```

#### 5. 查看安装状态
```bash
helm status wkim
```


#### 6. 卸载
```bash
helm uninstall wkim
```
