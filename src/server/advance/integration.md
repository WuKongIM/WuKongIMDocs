# 集成到自己系统

`所有WuKongIM的接口不要直接给APP端调用，应该前端先调用自己的业务API，业务API再调用WuKongIM的API，并且WuKongIM的API不要暴露给外网，这样可以保证数据的安全性。`

## 第一步：对接自己业务系统的用户

![集成用户流程](./integration.png)

1. 您的应用调用自己的登录或注册的业务接口。
2. 您的登录或注册的业务接口处理完自己的业务逻辑后将生成的用户 ID（uid）和 token，调用WuKongIM 的[登录或注册用户](/server/api/user#注册用户)接口更新到WuKongIM
3. 将 uid 和 token 返回给您自己的应用端。
4. 应用端调用WuKongIM 的 SDK 的 connect 方法，将 uid 和 token 传入，WuKongIM 的 SDK 会将 uid 和 token 传给WuKongIM 的服务端进行校验，如果客户端传的跟服务端传的一致将校验通过，校验通过后将保持长连接

## 第二步：提供 Webhook 接口

第三方服务提供一个 http api 接口，WuKongIM 将按照 Webhook[(详见文档)](/server/api/webhook)的约定将对应的数据按照事件的机制传递给此接口。

## 第三步：配置 Webhook 接口到WuKongIM

将您的 http api 接口配置到**_WuKongIM_**内。

```yaml
---
webhook: #
  httpAddr: 'http://xxxxx' # webhook的http地址 通过此地址通知数据给第三方
```

集成了WuKongIM 的 SDK 的应用的事件将会推送到第三方系统内，比如用户上线后，**_悟空 SDK_**会通知到**_WuKongIM_**端，**_WuKongIM_**将上线事件通过配置的 webhook 地址推送到第三方服务器。
