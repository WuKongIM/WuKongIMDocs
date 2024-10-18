# 说明

## 设计理念

为了让开发者更快更方便的使用 SDK，悟空 SDK 提供了一个唯一的入口来访问 SDK 中的所有功能。就像书籍的目录一样可以通过目录查找对应的内容。如连接 IM `WKIM.getInstance().getConnectionManager().connection()`

## 结构说明

![sdk结构图](./sdk.png) SDK 常用功能介绍

```java

// 消息管理器
// 负责消息的增删改查、新消息监听、刷新消息监听、消息入库、发送消息回执监听、监听同步某个聊天数据等
WKIM.getInstance().getMsgManager()

// 连接管理
// 负责IM的连接、断开、退出登录、监听连接状态、监听获取连接IP等
WKIM.getInstance().getConnectionManager()

// 频道管理
// 可获取Channel的信息，刷新Channel缓存，监听Channel更改[置顶、免打扰、禁言]、搜索Channel等
WKIM.getInstance().getChannelManager()

// 最近会话管理
// 获取最近聊天记录、刷新最近会话[新增聊天、红点改变]、监听移除某个会话、监听同步最近会话等
WKIM.getInstance().getConversationManager()

// 频道成员管理
// 获取Channel成员列表、设置成员备注、保存修改成员数据、监听刷新成员和移除成员等
WKIM.getInstance().getChannelMembersManager()

// 提醒管理
// 获取某个会话的提醒如：[有人@我] [入群申请] 等。还可自定义提醒项，如像 语音未读 等
WKIM.getInstance().getReminderManager()

// 命令管理
// 负责监听服务器下发的命令消息
WKIM.getInstance().getCMDManager()

// 机器人管理
// 可以获取机器人菜单、同步机器人菜单，查询菜单等
WKIM.getInstance().getRobotManager()
```
### SDK 与 APP 交互原则

![SDK与已有APP交互原则](./../sdk_app.png) sdk 与 app 交互流程就是 app 调用 sdk 提供的方法，sdk 处理完数据后通过事件将数据回调给 app。如发送消息流程：app 调用发送消息方法，sdk 将入库后的消息 push 给 app