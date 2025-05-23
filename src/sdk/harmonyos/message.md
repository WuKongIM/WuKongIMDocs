# 消息管理

### 发送消息
#### 说明
发送消息的方法
```typescript

 /**
  *  发送消息
  * @param model  消息内容
  * @param channel 频道对象 个人频道，群频道
*/
WKIM.shared.messageManager().send(model: WKMessageContent, channel: WKChannel);
```

#### 文本消息
```typescript
// 文本消息
let textModel: WKTextContent = new WKTextContent('你好，悟空')

// 发送给用户A
WKIM.shared.messageManager().send(textModel, new WKChannel('A', WKChannelType.personal));
```

#### 图片消息
```typescript
// 图片消息
let imageModel: WKImageContent = new WKImageContent(localPath)
imageModel.width = 100
imageModel.height = 100

// 发送给用户A
WKIM.shared.messageManager().send(imageModel, new WKChannel('A', WKChannelType.personal));
```

#### 自定义消息

参考自定义消息: [自定义消息](/sdk/harmonyos/advance.html#自定义消息)

### 消息入库返回（并不是消息发送状态）
在发送消息时，sdk 将消息保存在本地数据库后就会触发入库回调。此时消息并未进行发送，可在此监听中将消息展示在 UI 上

```typescript
 // 监听发送消息入库
WKIM.shared.messageManager().addInsertedListener((msg) => {
    // 将消息展示在 UI 上
})
```

### 新消息
监听新消息事件

```typescript
// 新消息监听器
newMsgsListener = (msgs: WKMsg[]) => {
   // 处理新消息
  }

// 监听新消息
WKIM.shared.messageManager().addNewMsgListener(this.newMsgsListener)

// 移除新消息监听
WKIM.shared.messageManager().removeNewMsgListener(this.newMsgsListener)
```

### 刷新消息
在 sdk 更新过消息时，如：消息发送状态，有人点赞消息，消息已读回执，消息撤回，消息被编辑等等，sdk 都将回调以下事件。UI 可通过消息对象WKMsg的clientMsgNO来判断具体是哪条消息发生了更改。

```typescript
// 刷新消息监听器
refreshMsgListener = (msg: WKMsg) => {
// 处理刷新消息
}

// 监听刷新消息
WKIM.shared.messageManager().addRefreshListener(this.refreshMsgListener)

// 移除刷新消息监听
WKIM.shared.messageManager().removeRefreshListener(this.refreshMsgListener)
```

### 查看某个频道的聊天信息
```typescript
let option = new ChannelMsgOptions(() => {
      // 同步中 按需显示loading
    }, (list) => {
        // 消息数据
    })
option.oldestOrderSeq = 0 // 最后一次消息大orderSeq 第一次进入聊天传入0
option.contain = false // 是否包含 oldestOrderSeq 这条消息
option.pullMode = 1 // 拉取模式 拉取模式 0:向下拉取 1:向上拉取
option.limit = 20 // 一次拉取消息数量
option.aroundMsgOrderSeq = 0 // 查询此消息附近消息 如 aroundMsgOrderSeq=20 返回数据则是 [16,17,19,20,21,22,23,24,25]
// 查看某个频道的聊天信息
WKIM.shared.messageManager().getOrSyncHistoryMessages(channel, option)
```


- <font color='#999' size=2>获取历史消息并不是同步方法，因为有可能存在非连续性时会往服务器同步数据</font>

### 离线消息
`需要实现同步频道消息数据源` [频道消息数据源](/sdk/harmonyos/datasource.html#频道消息数据源)

因为WuKongIM 是支持消息永久存储，所以会产生海量的离线消息。对此我们采用了按需拉取的机制，如 10 个会话一个会话 10 万条消息，WuKongIM 不会把这个 10\*10 万=100 万条消息都拉取到本地。 而是采用拉取这 10 个会话的信息和对应的最新 20 条消息，也就是实际只拉取了 200 条消息 相对 100 万条消息来说大大提高了离线拉取速度。用户点进对应的会话才会去按需拉取这个会话的消息。 这些机制 SDK 内部都已做好了封装，使用者其实不需要关心。使用者只需要关心最近会话的变化和监听获取数据的回调即可。


### 数据结构说明
#### 消息结构
```typescript
export class WKMsg {
  // 服务端唯一消息ID
  messageId = "";
  // 服务端消息序号
  messageSeq = 0;
  // 客户端消息序号
  clientSeq = 0;
  // 消息时间戳
  timestamp = 0;
  // 过期时间
  expireTime = 0;
  // 过期时间戳
  expireTimestamp = 0;
  // 客户端唯一编号
  clientMsgNo = "";
  // 发送者uid
  fromUID = "";
  // 所属频道ID
  channelId = "";
  // 所属频道类型
  channelType = WKChannelType.personal;
  // 消息类型
  contentType = 0;
  // 消息内容字符串
  content = "";
  // 消息状态 1.发送成功 0.发送中
  status = 0;
  voiceStatus = 0;
  // 是否删除 1.是
  isDeleted = 0;
  // 搜索关键字
  searchableWord = "";
  // 消息发送者资料
  private from?: WKChannel
  // 消息所属频道资料
  private channelInfo?: WKChannel
  // 消息发送者在频道内资料 群消息才有值
  private memberOfFrom?: WKChannelMember
  // 排序号
  orderSeq = 0;
  // 是否已读
  viewed = 0;
  // 已读时间
  viewedAt = 0;
  // 话题ID
  topicId = "";
  // 本地扩展
  localExtraMap?: Record<string, object>
  // 远程扩展
  wkMsgExtra?: WKMsgExtra
  // 消息回应点赞数据
  reactionList?: WKMsgReaction[]
  // 消息正文
  messageContent?: WKMessageContent
}
```

#### 消息正文结构
```typescript
export class WKMessageContent {
  // 消息类型
  contentType: number = 0
  // 消息内容
  content: string = ""
  // 渲染消息内容 如@某人时需要渲染@xxx这段文字
  entities?: ArrayList<WKMsgEntity>
  // 消息回复
  reply?: WKReply
  // 提醒信息
  mentionInfo?: WKMentionInfo
}
```