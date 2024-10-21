# 最近会话管理

### 获取最近会话
#### 所有最近会话

```javascrip
// 查询所有最近会话
let msgs = WKIM.shared.conversationManager().all()
```

#### 新消息

只有第一次打开应用时，需要同步最近会话列表， 后续最近会话列表的变化，通过监听来获取
```typescript
// 定义监听器
let listener =(list:WKConversation[]) => {
     // 当UI列表没有list中的数据时需执行添加操作
    }

// 监听新消息
 WKIM.shared.conversationManager().addRefreshListener(listener)

// 移出监听
 WKIM.shared.conversationManager().removeRefreshListener(listener)
 ```

 ### 删除最近会话
 ```typescript
 // 删除最近会话
WKIM.shared.conversationManager().delete(channelId, channelType)
```
调用删除最近会话后，会触发删除最近会话事件，UI可以监听删除最近会话事件，并将UI上的会话进行删除
```typescript
// 定义监听器
let listener = (channelId: string, channelType: number) => {
      // 删除UI上的会话
}

// 设置监听
WKIM.shared.conversationManager().addDeletedListener(listener)

// 移出监听
WKIM.shared.conversationManager().removeDeletedListener(listener)
```

### 数据结构说明
```typescript
export class WKConversation {
  channelId: string = ''                          // 频道ID
  channelType: number = WKChannelType.personal    // 频道类型
  lastClientMsgNo: string = ''                    // 最后一条消息的序列号
  isDeleted: number = 0                           // 是否被删除
  version: number = 0                             // 会话版本号
  unreadCount = 0                                 // 未读消息数
  lastMsgTimestamp = 0                            // 最后一条消息的时间戳
  lastMsgSeq = 0                                  // 最后一条消息的序列号
  parentChannelId = ''                            // 父会话ID
  parentChannelType = WKChannelType.personal      // 父会话类型
  localExtra?: Record<string, Object>             // 本地扩展字段
  remoteExtra?: WKConversationExtra               // 远程扩展字段
  private reminders?: WKReminder[]                // 提醒项
  private msg?: WKMsg                             // 最后一条消息
  private channel?: WKChannel                     // 频道信息
}

```
