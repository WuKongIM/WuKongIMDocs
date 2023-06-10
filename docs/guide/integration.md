---
group:
  title: 快速开始
  order: -1
order: 200
title: 集成到自己系统
---

# 集成到自己系统

## 第一步：提供 Webhook 接口

第三方服务提供一个 http api 接口，悟空 IM 将按照 Webhook[(详见文档)](/api/webhook)的约定将对应的数据按照事件的机制传递给此接口。

## 第二步：配置 Webhook 接口到悟空 IM

将您的 http api 接口配置到**_悟空 IM_**内。

```yaml

---
webhook: #
  httpAddr: 'http://xxxxx' # webhook的http地址 通过此地址通知数据给第三方
```

集成了悟空 IM 的 SDK 的应用的事件将会推送到第三方系统内，比如用户上线后，**_悟空 SDK_**会通知到**_悟空 IM_**端，**_悟空 IM_**将上线事件通过配置的 webhook 地址推送到第三方服务器。
