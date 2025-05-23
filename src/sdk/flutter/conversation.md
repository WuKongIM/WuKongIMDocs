# 最近会话管理

### 获取最近会话
#### 所有最近会话

```dart
// 查询所有最近会话
WKIM.shared.conversationManager.getAll();
```

#### 新消息

只有第一次打开应用时，需要同步最近会话列表， 后续最近会话列表的变化，通过监听来获取
```dart
// 监听刷新消息
 WKIM.getInstance().getConversationManager().addOnRefreshMsgListener("key", new IRefreshConversationMsg() {
            @Override
            public void onRefreshConversationMsg(WKUIConversationMsg wkUIConversationMsg, boolean isEnd) {
                // wkUIConversationMsg 最近会话消息内容 UI上已有该会话需进行更新，反之添加到UI上
                // isEnd 为了防止频繁刷新UI，当isEnd为true可刷新UI
            }
        });
// 移除监听
 WKIM.getInstance().getConversationManager().removeOnRefreshMsg("key");
 ```
### 删除最近会话

```dart
// 删除最近会话
WKIM.shared.conversationManager.deleteMsg(channelId,channelType);
```

### 常用方法

```dart
// 设置红点
WKIM.shared.conversationManager.updateRedDot(channelId,channelType,count);

// 删除所有最近会话
WKIM.shared.conversationManager.clearAll();
```

### 数据结构说明

```dart

class WKConversationMsg {
  //频道id
  String channelID = '';
  //频道类型
  int channelType = WKChannelType.personal;
  //最后一条消息本地ID
  String lastClientMsgNO = '';
  //是否删除
  int isDeleted = 0;
  //服务器同步版本号
  int version = 0;
  //最后一条消息时间
  int lastMsgTimestamp = 0;
  //未读消息数量
  int unreadCount = 0;
  //最后一条消息序号
  int lastMsgSeq = 0;
  //扩展字段
  dynamic localExtraMap;
  WKConversationMsgExtra? msgExtra;
  String parentChannelID = '';
  int parentChannelType = 0;
}

```