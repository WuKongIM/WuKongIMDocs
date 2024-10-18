# 高级功能

### 自定义消息
在WuKongIM 中所有的消息类型都是自定义消息

#### 自定义普通消息
下面我们以名片消息举例

##### 第一步 定义消息
定义消息对象并继承 WKMessageContent 并在构造方法中指定消息类型

```typescripts
// 定义名片消息
export class CardMessageContent extends WKMessageContent {
  uid: string = ''
  name: string = ''
  avatar: string = ''
  constructor() {
    super();
    this.contentType = 16 // 指定类型
  }
}
```

##### 第二步 编码和解码
我们需要将uid,name,avatar三个字段信息发送给对方，最终传递的消息内容为
```typescripts
{
  "type": 16,
  "uid": "xxxx",
  "name": "xxx",
  "avatar": "xxx"
}
```
重写`WKMessageContent`的`encodeJson`方法开始编码

```typescripts

  // 编码发送内容
  encodeJson(): Record<string, Object> {
    let json: Record<string, Object> = {}
    json['uid'] = this.uid
    json['name'] = this.name
    json['avatar'] = this.avatar
    return json
  }

```
重写`WKMessageContent`的`decodeJson`方法开始解码
```typescripts

  // 解码内容
  decodeJson(jsonStr: string): WKMessageContent {
    let json = CommonUtil.jsonToRecord(jsonStr)
    if (json !== undefined) {
      this.uid = CommonUtil.readString(json, 'uid')
      this.name = CommonUtil.readString(json, 'name')
      this.avatar = CommonUtil.readString(json, 'avatar')
    }
    return this
  }
```
- <font color='#999' size=2>解码和编码消息时无需将 `type` 字段考虑其中，sdk 内部会自动处理</font>
##### 第三步 注册消息
```typescripts
 // 注册自定义消息
WKIM.shared.messageManager().registerMsgContent(16, (jsonStr: string) => {
    return new CardMessageContent().decodeJson(jsonStr)
})
```
对此通过这三步自定义普通消息就已完成。在收到消息时`WKMsg`中的`type`为16就表示该消息是名片消息，其中`messageContent`则为自定义的`CardMessageContent`，这时可将`messageContent`强转为`CardMessageContent`并渲染到UI上
完整代码
```typescripts

// 自定义普通消息
export class CardMessageContent extends WKMessageContent {
  uid: string = ''
  name: string = ''
  avatar: string = ''
  constructor() {
    super();
    this.contentType = 16 // 指定类型
  }

  // 编码发送内容
  encodeJson(): Record<string, Object> {
    let json: Record<string, Object> = {}
    json['uid'] = this.uid
    json['name'] = this.name
    json['avatar'] = this.avatar
    return json
  }

  // 解码内容
  decodeJson(jsonStr: string): WKMessageContent {
    let json = CommonUtil.jsonToRecord(jsonStr)
    if (json !== undefined) {
      this.uid = CommonUtil.readString(json, 'uid')
      this.name = CommonUtil.readString(json, 'name')
      this.avatar = CommonUtil.readString(json, 'avatar')
    }
    return this
  }

  // 最近会话显示内容
  displayText(): string {
    return '[名片]'
  }
}
```
### 自定义附件消息
我们在发送消息的时候有时需发送带附件的消息。WuKongIM 也提供自定义附件消息，自定义附件消息和普通消息区别不大。下面我们已地理位置消息举例

##### 第一步 定义消息
值得注意的是自定义附件消息需继承`WKMediaMessageContent`而不是`WKMessageContent`
```typescripts
export class LocationMessageContent extends WKMediaMessageContent {
  address: string = ''
  longitude: number = 0.0
  latitude: number = 0.0

  constructor() {
    super();
    this.contentType = 17 // 指定类型
  }
}
```

- <font color='#999' size=2>`WKMediaMessageContent`提供了`url`，`localPath`字段，自定义消息无需在定义网络地址和本地地址字段</font>

##### 第二步 编码和解码
我们需要将`longitude`,`latitude`,`address`,`url`信息发送给对方，最终传递的消息内容为
```typescripts
{
  "type": 17,
  "longitude": 115.25,
  "latitude": 39.26,
  "url": "xxx",
  "address": "xxx"
}
```
重写`WKMessageContent`的encodeJson方法开始编码
```typescripts
// 编码
encodeJson(): Record<string, Object> {
let json: Record<string, Object> = {}
json['url'] = this.url
json['longitude'] = this.longitude
json['latitude'] = this.latitude
return json
}
```
重写`WKMessageContent`的`decodeJson`方法开始解码
```typescripts
// 解码
decodeJson(jsonStr: string): WKMessageContent {
let json = CommonUtil.jsonToRecord(jsonStr)
if (json !== undefined) {
    this.address = CommonUtil.readString(json, 'address')
    this.url = CommonUtil.readString(json, 'url')
    this.longitude = CommonUtil.readNumber(json, 'longitude')
    this.latitude = CommonUtil.readNumber(json, 'latitude')
}
return this
}
```
##### 第三步 注册消息
```typescripts
// 注册自定义消息
WKIM.shared.messageManager().registerMsgContent(17, (jsonStr: string) => {
      return new LocationMessageContent().decodeJson(jsonStr)
    })
```
### 消息扩展
随着业务的发展应用在聊天中的功能也日益增多，为了满足绝大部分的需求 WuKongIM 中增加了消息扩展功能。消息扩展分`本地扩展`和`远程扩展`，本地扩展只针对 app 本地使用卸载 app 后将丢失，远程扩展是服务器保存卸载重装后数据将恢复
#### 本地扩展
本地扩展就是消息对象`WKMsg`中的l`localExtraMap`字段
```typescripts
/**
  * 修改消息本地扩展
  *
  * @param clientMsgNo 客户端ID
  * @param extra   扩展字段
  */
WKIM.shared.messageManager().updateLocalExtra(clientMsgNo: string, extra: Record<string, Object>)
```

- <font color='#999' size=2>更新成功后 sdk 会触发刷新消息回调</font>
#### 远程扩展
远程扩展就是消息对象`WKMsg`中的`remoteExtra`字段

```typescripts
WKIM.shared.messageManager().saveRemoteExtras(list: WKMsgExtra[])
```

- <font color='#999' size=2>更新成功后 sdk 会触发刷新消息回调</font>
##### 数据结构说明
```typescripts

export class WKMsgExtra {
  // 消息ID
  messageId = ''
  // 频道ID
  channelId = ''
  // 频道类型
  channelType: number = WKChannelType.personal
  // 是否已读 1.是
  readed = 0
  // 已读数量
  readedCount = 0
  // 未读数量
  unreadCount = 0
  // 是否撤回 1.是
  revoke = 0
  // 是否删除
  isMutualDeleted = 0
  // 撤回者uid
  revoker = ''
  // 版本号
  extraVersion = 0
  // 编辑时间
  editedAt = 0
  // 编辑内容
  contentEdit = ''
  // 是否需要上传 1.是
  needUpload = 0
  // 是否置顶
  isPinned = 0
  // 编辑后正文
  contentEditMsgModel?: WKMessageContent
}

```
### 消息已读未读
消息的已读未读又称消息回执。消息回执功能可通过 setting 进行设置

```typescripts
let option = new WKSendOptions()
option.setting.receipt = 1 // 开启回执
// 发送消息
WKIM.shared.messageManager().sendWithOption(textModel, channel, option)
```
当登录用户浏览过对方发送的消息时，如果对方开启了消息回执这时需将查看过的消息上传到服务器标记该消息已读。当对方或者自己上传过已读消息这时业务服务器会下发同步消息扩展的 cmd(命令)消息`syncMessageExtra`,此时需同步最新消息扩展保存到 sdk 中

### 消息编辑
当我们给对方发送消息发现发送内容有错误时，这时无需撤回重发只需要将消息编辑即可

<video controls height='30%' width='30%' src="/video/msgedit.mp4"></video>
#### 设置编辑内容
```typescripts
/**
  * 修改编辑内容
  * @param messageId 消息服务器ID
  * @param channelId 频道ID
  * @param channelType 频道类型
  * @param content 编辑后的内容
  */
WKIM.shared.messageManager().updateEdit(messageId: string, channelId: string, channelType: number, content: string)
```
更改 sdk 消息编辑内容后需将编辑后的内容上传到服务器,则需要监听上传消息扩展

```typescripts
WKIM.shared.config.provider.uploadMessageExtraCallback = (extra: WKMsgExtra) => {
      //上传到业务服务器
    }
```
### 消息回复


在聊天中如果消息过多，发送消息回复就会显得消息很乱无章可循。这时就需要对某条消息进行特定的回复，即消息回复，如以下效果 <img src='./../msg_reply.jpg' width=30%/>

在发送消息时，只需将消息正文`WKMessageContent`中的`WKReply`对象赋值就能对达到消息回复效果

```typescripts
let textModel: WKTextContent = new WKTextContent(this.sendContent)
textModel.reply  = new WKReply()
textModel.reply.messageId = ''
// 设置其他字段信息

// 发送消息
WKIM.shared.messageManager().send(textModel, channel)
```

#### 回复消息结构说明
```typescripts

export class WKReply {
  // 被回复的消息根ID，多级回复时的第一次回复的消息ID
  rootMid = ''
  // 被回复的消息ID
  messageId = ''
  // 被回复的MessageSeq
  messageSeq = 0
  // 被回复者uid
  fromUID = ''
  // 被回复者名称
  fromName = ''
  // 被回复的消息字符串
  contentEdit = ''
  // 编辑时间
  editAt = 0
  // 回复消息被撤回标记 1.是
  revoke = 0
  // 被回复消息编辑后的内容
  contentEditMsgModel?: WKMessageContent
  // 被回复的消息体
  payload?: WKMessageContent
}
```

### 消息回应(点赞)
#### 保存
```typescripts
WKIM.shared.messageManager().saveReactions(list: WKMsgReaction[])
```

- <font color='#999' size=2>同一个用户对同一条消息只能做出一条回应。重复进行消息不同 emoji 的回应会做为修改回应，重复进行相同 emoji 的回应则做为删除回应</font> sdk 更新消息回应后会触发消息刷新的事件。app 需监听此事件并对 UI 进行刷新
监听消息回应刷新
```typescripts
// 监听消息回应刷新
WKIM.shared.messageManager().addRefreshReactionListener((list)=>{
    // 刷新 UI
    })
```
#### 获取

```typescripts
WKIM.shared.messageManager().getMsgReactions(messageId:string)
```

#### 数据结构说明
```typescripts
export class WKMsgReaction {
  // 消息ID
  messageId = ""
  // 频道ID
  channelId = ""
  // 频道类型
  channelType = WKChannelType.personal
  // 回应者uid
  uid = ""
  // 消息序号
  seq = 0
  // 回应表情
  emoji = ""
  // 是否删除 1.是
  isDeleted = 0
  // 创建时间
  createdAt = ""
}

```