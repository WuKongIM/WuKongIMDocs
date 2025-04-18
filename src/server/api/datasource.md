---
title: Datasource
order: 500
---

# Datasource

数据源解决的问题主要是一些现有系统里已有群成员和一些其他数据，需要无缝对接到**WuKongIM**通讯里，那么就可以通过数据源的形式对接

`数据源只有在重启后第一次启动时才会加载，如果需要重新加载数据源，需要重启服务`

**WuKongIM**会调用 datasource 配置的 api 地址，通过 POST 的方式进行请求

请求数据格式如下：

```json
{
  "cmd": "xxx", // 请求指令
  "data": {} // 请求参数
}
```

详情如下：

### 获取订阅者(群成员)

当**WuKongIM**通讯端需要获取订阅者列表的时候就会调用此 cmd 进行获取

请求参数

```json
{
  "cmd": "getSubscribers",
  "data": {
    "channel_id": "xxx", // 频道ID（群ID）
    "channel_type": 2 // 默认为2 2表示群聊
  }
}
```

返回结果

```json
[uid1,uid2,...] // 当前频道的成员用户id列表
```

### 获取黑名单

如果不允许频道成员内某个人收不到消息，可以返回黑名单

请求参数

```json
{
  "cmd": "getBlacklist",
  "data": {
    "channel_id": "xxx", // 频道ID（群ID）
    "channel_type": 1 // 频道类型 1.单聊 2.群聊
  }
}
```

返回结果

```json
[uid1,uid2,...] // 黑名单成员用户id集合
```

### 获取白名单

如果只允许频道内某些人收到消息，则返回收到消息的成员用户 id 列表。
比如实现群禁言，那么可以返回群主和管理员的 uid，这样其他群成员将无法发送消息，只有群主和管理能发送消息
比如实现只有好友才能发送消息，那么返回用户的好友列表则不是好友将无法发送消息

请求参数

```json
{
  "cmd": "getWhitelist",
  "data": {
    "channel_id": "xxx", // 频道ID（群ID）
    "channel_type": 1 // 频道类型 1.单聊 2.群聊
  }
}
```

返回结果

```json
[uid1,uid2,...] // 白名单成员用户id集合
```

### 获系统账号

系统账号不受黑名单白名单限制，而且系统账号不在某个频道内也可以发送消息，也就是对发送消息无如何限制

请求参数

```json
{
  "cmd": "getSystemUIDs"
}
```

返回结果

```json
[uid1,uid2,...] // 系统账号用户id集合
```
