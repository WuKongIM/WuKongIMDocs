
# 升级

## 说明

`WuKongIM`的版本号规则为`主版本号.次版本号.修订号`，例如`1.0.0`。当修订号增加时，表示有bug修复或者小功能更新；当次版本号增加时，表示有新功能加入；当主版本号增加时，表示有不兼容的API变动。

所以只要不升级大版本，升级过程都是平滑的。

## 升级步骤

将`docker-compose.yml`中的`wukongim`服务的`image`字段修改为新版本即可。

例如：

```yaml
version: '3.7'
services:
...
  wukongim: # WuKongIM服务
    image: wukongim/wukongim:2.x.x # 新版本号

```

使用如下命令获取最新镜像

```bash
docker-compose pull wukongim
```

重启

```bash
docker-compose up -d
```