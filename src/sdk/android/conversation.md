# 最近会话管理

`需要实现最近会话数据源` [最近会话数据源](/sdk/android/datasource.html#最近会话数据源)

### 获取最近会话列表
#### 所有最近会话
`Java`
```java
// 查询所有最近会话
WKIM.getInstance().getConversationManager().getAll();
```
`Kotlin`

```kotlin
// 查询所有最近会话
WKIM.getInstance().conversationManager.getAll()
```
#### 新消息
只有第一次打开应用时，需要同步最近会话列表， 后续最近会话列表的变化，通过监听来获取

`Java`

```java
 WKIM.getInstance().getConversationManager().addOnRefreshMsgListener("key", new IRefreshConversationMsg() {
            @Override
            public void onRefreshConversationMsg(WKUIConversationMsg wkUIConversationMsg, boolean isEnd) {
                // wkUIConversationMsg 最近会话消息内容 UI上已有该会话需进行更新，反之添加到UI上
                // isEnd 为了防止频繁刷新UI，当isEnd为true可刷新UI
            }
        });
```

`Kotlin`

```kotlin
 WKIM.getInstance().conversationManager.addOnRefreshMsgListener(
            "key"
        ) { wkUIConversationMsg, isEnd ->
            // wkUIConversationMsg 最近会话消息内容 UI上已有该会话需进行更新，反之添加到UI上
            // isEnd 为了防止频繁刷新UI，当isEnd为true可刷新UI
        }
```

### 移除最近会话
#### 删除
`Java`

```java
// 删除某个最近会话
WKIM.getInstance().getConversationManager().deleteWitchChannel(String channelId, byte channelType);
```

`Kotlin`

```kotlin
// 删除某个最近会话
WKIM.getInstance().conversationManager.deleteWitchChannel(channelId, channelType)
```

#### 监听删除
在删除某个最近会话时会回调此方法

`Java`

```java
WKIM.getInstance().getConversationManager().addOnDeleteMsgListener("key", new IDeleteConversationMsg() {
            @Override
            public void onDelete(String channelID, byte channelType) {
                // channelID 聊天频道ID
                // channelType 聊天频道类型
            }
        });
```

`Kotlin`

```kotlin
WKIM.getInstance().conversationManager.addOnDeleteMsgListener(
            "key"
        ) { channelID, channelType ->
            // channelID 聊天频道ID
            // channelType 聊天频道类型
        }
```
### 常用方法

`Java`

```java
// 查询所有最近会话
WKIM.getInstance().getConversationManager().getAll();

// 修改消息红点
WKIM.getInstance().getConversationManager().updateRedDot(String channelID, byte channelType, int redDot);

// 删除某个会话
WKIM.getInstance().getConversationManager().deleteMsg(String channelId, byte channelType);
```

`Kotlin`

```kotlin
// 查询所有最近会话
WKIM.getInstance().conversationManager.getAll()

// 修改消息红点
WKIM.getInstance().conversationManager.updateRedDot( channelID, channelType, redDot)

// 删除某个会话
WKIM.getInstance().conversationManager.deleteMsg( channelId, channelType)
```

### 数据结构说明
WKUIConversationMsg 类核心数据

```java
public class WKUIConversationMsg {
  // 最后一条消息时间
  public long lastMsgTimestamp;
  // 消息频道 频道资料，可能为空，如果为空可以调用 WKChannelManager 的 fetchChannelInfo(channelID, channelType); 触发频道信息变更
  private WKChannel wkChannel;
  // 消息正文
  private WKMsg wkMsg;
  // 未读消息数量
  public int unreadCount;
  // 远程扩展
  private WKConversationMsgExtra remoteMsgExtra()
  // 本地扩展字段
  public HashMap<String, Object> localExtraMap;
  //  最近会话提醒项 如[有人@你][群内审核]等
  public List<WKReminder> getReminderList(){
    // ...
  }
  // 获取远程扩展
  public WKConversationMsgExtra getRemoteMsgExtra(){
    // ...
  }
  // 会话channel信息
  public WKChannel getWkChannel(){
    // ...
  }
}
```