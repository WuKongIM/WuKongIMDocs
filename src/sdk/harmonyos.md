---
title: HarmonyOS SDK
order: 200
---
# HarmonyOS SDK

## 设计理念

为了让开发者更快更方便的使用 SDK，悟空 SDK 提供了一个唯一的入口来访问 SDK 中的所有功能。就像书籍的目录一样可以通过目录查找对应的内容。如连接 IM `WKIM.shared.connectionManager().connection();`

## 结构说明

![sdk结构图](./fluttersdk.png)

SDK 常用功能介绍
```typescript
// 连接管理
// 负责IM的连接、断开、退出登录、监听连接状态等
WKIM.shared.connectionManager()

// 消息管理
// 负责消息的增删改查、新消息监听、刷新消息监听、消息入库等
WKIM.shared.messageManager()

// 会话管理
// 负责会话的增删改查、会话列表监听、会话消息监听等
WKIM.shared.conversationManager()

// 频道管理
// 可获取Channel的信息，刷新Channel缓存，监听Channel更改[置顶、免打扰、禁言]等
WKIM.shared.channelManager()

// 频道成员管理
// 获取Channel成员列表、设置成员备注、保存修改成员数据、监听刷新成员和移除成员等
WKIM.shared.channelMemberManager()

// 提醒项管理
// 获取某个会话的提醒如：[有人@我] [入群申请] 等。还可自定义提醒项，如像 语音未读 等
WKIM.shared.reminderManager()

// 命令管理
// 负责监听服务器下发的命令消息
WKIM.shared.cmdManager()
```
## 集成

### 下载安装
```
ohpm install @wukong/wkim
```
### 引入
```
import { WKIM } from '@wukong/wkim';
```

### SDK 与 APP 交互原则

![SDK与已有APP交互原则](./sdk_app.png) sdk 与 app 交互流程就是 app 调用 sdk 提供的方法，sdk 处理完数据后通过事件将数据回调给 app。如发送消息流程：app 调用发送消息方法，sdk 将入库后的消息 push 给 app

**初始化sdk**
```typescript
// uid 登录用户ID（业务服务端在IM通讯端登记了的uid））
// token 登录用户token（业务服务端在IM通讯端登记了的token）
await WKIM.shared.init(uid, token)
```

**连接地址**
```typescript
WKIM.shared.config.provider.connectAddrCallback = (): Promise<string> => {
    // 通过网络获取连接地址后返回
    let add = HttpUtil.getIP()
    return add
}
```
- <font color="#999" font-size=2>返回 IM 通信端的 IP 和 IM 通信端的 TCP 端口。<font color="#FF0000">分布式可调用接口获取 IP 和 Port 后返回</font></font>

## 连接管理

### 连接
```typescript
// 连接
WKIM.shared.connectionManager().connection()
```

### 断开
```typescript
// 断开 isLogout true：退出并清空用户信息 false：退出保持用户信息
WKIM.shared.connectionManager().disConnection(isLogout)
```

### 监听连接状态
```typescript
// 监听连接状态
WKIM.shared.connectionManager()
  .addConnectStatusListener((status: number, reasonCode?: number, connInfo?: ConnectionInfo) => {
    switch (status) {
      case WKConnectStatus.success: {
       // `悟空IM(连接成功-节点:${connInfo?.nodeId})`
        break
      }
      case WKConnectStatus.fail:
        // '连接失败'
        break
      case WKConnectStatus.connecting:
       // '连接中...'
        break
      case WKConnectStatus.syncing:
       // '同步中...'
        break
      case WKConnectStatus.syncCompleted:
       // `悟空IM(连接成功-节点:${this.nodeId})`
        break
      case WKConnectStatus.noNetwork:
       // '网络异常'
        break
      case WKConnectStatus.kicked:
       // '其他账号登录'
        break
    }
  })
```

## 消息管理

### 发送消息
#### 普通消息
```typescript
// 构造消息model
let textModel: WKTextContent = new WKTextContent('你好,我是文本消息')
// 指定频道 
let channel: WKChannel = new WKChannel('uid',WKChannelType.personal)
// 发送
WKIM.shared.messageManager().send(textModel,channel)
```
#### 高级设置消息
```typescript
// 构造消息model
let textModel: WKTextContent = new WKTextContent('你好,我是文本消息')
// 指定频道 
let channel: WKChannel = new WKChannel('uid',WKChannelType.personal)
let option = new WKSendOptions()
option.setting.receipt = 1 // 开启回执
option.setting.topic = 1  // 话题消息
option.setting.stream = 1 // 流消息
option.header.noPersist = true // 发送不存储消息
option.header.redDot = false // 发送不显示红点消息
option.topicId = '' // option.setting.topic = 1 时指定话题ID
option.expire = 300 // 消息过期时间
WKIM.shared.messageManager().sendWithOption(textModel, channel, option)
```
### 消息入库
当发送消息时消息会先入库，再将消息发送给对方。消息入库时会通知UI将该消息展示到UI上，UI可以监听消息入库事件，并刷新消息列表
```typescript
// 监听发送消息入口
WKIM.shared.messageManager().addInsertedListener((msg) => {
    // 展示消息到UI上
})
```
### 发送状态
当消息发送成功或失败时会通知UI消息发送状态，UI可以监听消息发送状态事件，并刷新消息发送状态

```typescript
sendResultListener = (clientMsgSeq: number, messageId: string, messageSeq: number, reasonCode: number) => {
  // clientMsgSeq 消息在客户端的序列号
  // messageId 消息在服务端的ID
  // messageSeq 消息在服务端的序列号
  // reasonCode 发送结果 1.成功 2.失败 
  }

// 监听消息发送状态
WKIM.shared.messageManager().addSendStatusListener(this.sendResultListener)

// 在退出页面时移除监听
WKIM.shared.messageManager().removeSendStatusListener(this.sendResultListener)
```
### 新消息
```typescript

newMsgsListener = (msgs: WKMsg[]) => {
  // msgs 新消息列表
  }

// 监听新消息
WKIM.shared.messageManager().addNewMsgListener(this.newMsgsListener)

// 在退出页面时移除监听
WKIM.shared.messageManager().removeNewMsgListener(this.newMsgsListener)
```
- <font color='#999' size=2>如果在聊天页面内收到新消息时需判断该消息是否属于当前会话，可通过消息对象`WKMsg`的`channelId`和`channelType`判断</font>

### 刷新消息
当用户主动调用修改的方法或收到cmd执行修改本地消息后，都将触发刷新消息事件，UI可以监听刷新消息事件，并刷新消息列表

```typescript
refreshMsgListener = (msg: WKMsg) => {
  // 刷新消息列表
  }

// 监听刷新消息
WKIM.shared.messageManager().addRefreshListener(this.refreshMsgListener)

// 在退出页面时移除监听
WKIM.shared.messageManager().removeRefreshListener(this.refreshMsgListener)
```
### 删除消息
用户主动调用删除或收到cmd执行删除本地消息后，将触发删除消息事件，UI可以监听删除消息事件，并将UI上的消息进行删除

```typescript
deletedMsgListener = (clientMsgNo: string) => {
  // 通过`clientMsgNo`删除消息
  }

// 监听删除消息
WKIM.shared.messageManager().addDeletedListener(this.deletedMsgListener)

// 在退出页面时移除监听
WKIM.shared.messageManager().removeDeletedListener(this.deletedMsgListener)
```

### 消息扩展

随着业务的发展应用在聊天中的功能也日益增多，为了满足绝大部分的需求 WuKongIM 中增加了消息扩展功能。消息扩展分`本地扩展`和`远程扩展`，本地扩展只针对应用本地使用卸载应用后将丢失，远程扩展是服务器保存卸载重装后数据将恢复

#### 本地扩展
本地扩展就是消息对象`WKMsg`中的`localExtraMap`字段
```typescript
// 修改本地扩展消息
WKIM.shared.messageManager().updateLocalExtra(clientMsgNo: string, extra: Record<string, Object>)
```
- <font color="#999" font-size=2>调用修改本地扩展消息方法后会触发刷新消息事件</font>

#### 远程扩展

远程扩展就是消息对象`WKMsg`中的`wkMsgExtra`对象
```typescript
export class WKMsgExtra {
  messageId = ''            // 服务端唯一ID
  channelId = ''            // 频道ID
  channelType = 0           // 频道类型
  readed = 0                // 是否已读 0.未读 1.已读
  readedCount = 0           // 已读人数
  unreadCount = 0           // 未读人数
  revoke = 0                // 是否撤回 0.未撤回 1.已撤回
  isMutualDeleted = 0       // 消息是否远程删除 0.未删 1.已删
  revoker = ''              // 撤回人uid
  extraVersion = 0          // 扩展版本
  editedAt = 0              // 编辑时间
  contentEdit = ''          // 编辑后内容
  needUpload = 0            // 是否需要上传 0.不需要 1.需要
  isPinned = 0              // 是否置顶 0.未置顶 1.置顶
  contentEditMsgModel?: WKMessageContent // 编辑后消息内容结构体
}
```

##### 保存或更新远程扩展

```typescript
// 保存或更新远程扩展
WKIM.shared.messageManager().saveMessageExtras(list: WKMsgExtra[])
```
在保存消息扩展后，sdk会通知UI刷新对应消息的远程扩展信息。UI可以监听刷新远程扩展事件，并刷新消息
##### 刷新扩展消息
```typescript
refreshExtraListener = (extras:WKMsgExtra[]) =>{
    // 刷新消息列表
}

// 监听刷新远程扩展
WKIM.shared.messageManager().addRefreshExtraListener(this.refreshExtraListener)

// 在退出页面时移除监听
WKIM.shared.messageManager().removeRefreshExtraListener(this.refreshExtraListener)
```
##### 上传扩展消息
在使用编辑消息功能时需调用sdk的`updateEdit`方法，sdk会将本地的编辑后的内容保存到本地并通知用户将编辑内容同步至服务器。这时用户需提供上传消息扩展的提供者，即`WKIM.shared.config.provider.uploadMessageExtraCallback`

```typescript
// 上传扩展消息提供者
WKIM.shared.config.provider.uploadMessageExtraCallback =(extra: WKMsgExtra):void=>{
  // 将extra的编辑内容上传至服务器
}
```
### 历史消息
`需要实现同步频道消息数据源` 参考：[同步频道消息数据源](/sdk/harmonyos.html#历史消息提供者)
获取某个channel的历史消息
```typescript
WKIM.shared.messageManager().getOrSyncHistoryMessages(new WKChannel(this.channelId, this.channelType), option)
```
option参数说明
```typescript
export class ChannelMsgOptions {
oldestOrderSeq: number = 0      // 起始消息序列号 第一次传0
contain: boolean = false        // 是否包含 `oldestOrderSeq` 或 `aroundMsgOrderSeq` 这条消息 
pullMode: number = 0            // 0.表示向下拉取 1.表示向上拉取
limit: number = 0               // 拉取消息数量
aroundMsgOrderSeq: number = 0   // 附近消息的序列号
iSyncing: ISyncing              // 网服务器同步消息回掉
iResult: IResult                // 拉取消息结果回掉
}
```

## 最近会话管理
`需实现同步最近会话数据源` 参考：[同步最近会话数据源](/sdk/harmonyos.html#同步最近会话提供者)

### 所有消息
查询所有最近会话
```typescript
let msgs = WKIM.shared.conversationManager().all()
```
### 刷新消息
当第一次进入应用时本地没有最近会话数据，需要同步最近会话数据。同步数据后会触发刷新最近会话事件，UI可以监听刷新最近会话事件，并刷新会话列表
```typescript
WKIM.shared.conversationManager().addRefreshListener((list:WKConversation[]) => {
     // 当UI列表没有list中的数据时需执行添加操作
    })
```
### 删除消息
```typescript
WKIM.shared.conversationManager().delete(channelId, channelType)
```
调用删除最近会话后，会触发删除最近会话事件，UI可以监听删除最近会话事件，并将UI上的会话进行删除
```typescript
WKIM.shared.conversationManager().addDeletedListener((channelId: string, channelType: number) => {
      // 删除UI上的会话
    })
```
### 最近会话扩展
核心数据
```typescript
export class WKConversationExtra {
  channelId: string = ''    // 频道ID
  channelType: number = 1   // 频道类型
  browseTo = 0              // 最近浏览位置
  keepMessageSeq = 0        // 最近消息序列号
  keepOffsetY = 0           // 消息item偏移高度
  draft = ''                // 草稿内容
  version = 0               // 扩展版本
  draftUpdatedAt = 0        // 草稿更新时间
}
```

监听刷新最近会话扩展事件
```typescript
WKIM.shared.conversationManager().addRefreshExtrasListener((e) => {
    
})
```

## 频道管理

频道(Channel)WuKongIM 中是一个比较抽象的概念。发送消息都是先发送给频道，频道根据自己的配置规则进行投递消息，频道分频道和频道详情。 更多介绍请移步[什么是频道](/guide/initialize#频道)

频道属性
```typescript
export class WKChannel {
  channelId: string             // 频道ID  
  channelType: number           // 频道类型
  channelName: string = ""      // 频道名称
  channelRemark: string = ""    // 频道备注
  showNick: number = 0          // 显示昵称 0.不显示 1.显示
  top: number = 0               // 置顶 0.不置顶 1.置顶
  save: number = 0              // 是否保存到通讯录 0.不保存 1.保存
  mute: number = 0              // 是否免打扰 0.不免打扰 1.免打扰
  forbidden: number = 0         // 是否禁言 0.不禁言 1.禁言
  invite: number = 0            // 是否允许邀请 0.不允许 1.允许
  status: number = 0            // 频道状态 0.禁用 1.正常
  follow: number = 0            // 关注状态 0.未关注 1.已关注
  isDeleted: number = 0         // 是否删除 0.未删除 1.已删除
  createdAt: string = ''        // 创建时间
  updatedAt: string = ''        // 更新时间
  avatar: string = ''           // 头像
  version: number = 0           // 频道版本
  online: number = 0            // 在线状态 0.离线 1.在线
  lastOffline: number = 0       // 最后离线时间
  deviceFlag: number = 0        // 设备标识 0.APP 1.WEB 2.PC
  receipt: number = 0           // 是否开启回执 0.未开启 1.开启
  robot: number = 0             // 是否为机器人 0.不是 1.是
  category: string = ''         // 频道分类
  username: string = ''         // 用户名
  avatarCacheKey: string = ''   // 头像缓存key
  localExtra?: Record<string, Object>   // 本地扩展
  remoteExtra?: Record<string, Object>  // 远程扩展
  parentChannelId: string = ''          // 父频道ID
  parentChannelType: number = 0         // 父频道类型
}

```
### 频道资料

`需要实现获取频道资料的数据源` [获取频道资料数据源](/sdk/harmonyos.html#频道资料提供者)

获取channel资料
```typescript
let channel = WKIM.shared.channelManager().getChannel(channelId, channelType)
```
### 监听刷新频道
```typescript
refreshChannelListener = (channel: WKChannel) => {
   // 刷新
  }
  // 添加刷新频道监听
WKIM.shared.channelManager().addRefreshListener(this.refreshChannelListener)

// 在退出页面时移除监听
WKIM.shared.channelManager().removeRefreshListener(this.refreshChannelListener)
```
### 强制刷新某个频道
```typescript
WKIM.shared.channelManager().fetchChannelInfo(channelId, channelType)
```
## 频道成员管理

`需要实现获取频道成员资料的数据源` [获取频道成员资料数据源](/sdk/harmonyos.html#频道成员提供者)

### 获取频道成员
```typescript
// 获取某个channel下的所有成员
let members = WKIM.shared.channelMemberManager().getMembers(channelId, channelType)
```
### 监听刷新频道成员
```typescript
refreshChannelMemberListener = (members: WKChannelMember[]) => {
  // 刷新
}
// 添加刷新频道成员监听
WKIM.shared.channelMemberManager().addRefreshListener(this.refreshChannelMemberListener)

// 在退出页面时移除监听
WKIM.shared.channelMemberManager().removeRefreshListener(this.refreshChannelMemberListener)
```

### 分页查询频道成员
`需要实现分页获取频道成员资料的数据源` [获取分页频道成员资料数据源](/sdk/harmonyos.html#频道成员分页数据提供者)

```typescript
// 分页获取频道成员
WKIM.shared.channelMemberManager().getWithPageOrSearch(channelId, channelType,option)
```
参数`option`说明
```typescript
export class SyncChannelMemberOptions {
  searchKey: string = ''  // 搜索关键字
  page: number = 0       // 页码
  limit: number = 20    // 每页数量
}
```
## CMD(命令)管理
CMD(命令)消息只能是服务器下发客户端进行解析
cmd消息格式
```typescript
export class WKCMD {
  cmd: string = ''              // 命令id
  paramJsonObject?: Record<string, Object> // 对应命令参数
}
```
### 监听CMD消息
```typescript
cmdListener = (cmd: WKCMD) => {
  // 处理CMD消息
}
// 添加CMD消息监听
WKIM.shared.cmdManager().addCmdListener(this.cmdListener)


// 在退出页面时移除监听
WKIM.shared.cmdManager().removeCmdListener(this.cmdListener)
```
## 提醒项管理
会话提醒目前只支持服务器下发指令。客户端只需监听同步会话提醒和监听刷新会话消息即可
提醒项属性
```typescript
export class WKReminder {
  reminderId = 0                 // 提醒ID
  messageId = ''                // 消息ID
  channelId: string = ''        // 频道ID        
  channelType: number = 1       // 频道类型
  messageSeq = 0                // 消息序列号
  type = 0                      // 提醒类型[1、有人@你][2、群内审核] 等
  isLocate = 0                  
  uid = ''
  text = ''
  data?: Record<string, Object> //  提醒包含的自定义数据
  version = 0
  done = 0                       // 0.未完成 1.已完成
  needUpload = 0                 // 0.不需要上传 1.需要上传
  publisher = ''                 // 发布人uid
}

```
### 获取提醒项
```typescript
// 获取某个channel下的提醒项 done: 0.未完成 1.已完成
let reminders = WKIM.shared.reminderManager().get(channelId, channelType,done)
```

### 保存提醒项
```typescript
WKIM.shared.reminderManager().save(list)
```
### 监听新的提醒项
```typescript
refreshListener = (list: WKReminder[]) => {
  // 刷新提醒列表
}

// 添加刷新提醒项监听
WKIM.shared.reminderManager().addRefreshListener(this.refreshListener)

// 在退出页面时移除监听
WKIM.shared.reminderManager().removeRefreshListener(this.refreshListener)
```
## 高级功能

### 自定义消息
#### 自定义普通消息
在WuKongIM 中所有的消息类型都是自定义消息。下面我们以`名片`消息举例
**自定义消息结构**
定义消息对象并继承 `WKMessageContent` 并在构造方法中指定消息类型

- <font color='#999' size=2>SDK 内置消息类型可通过 `WKMsgContentType` 查看</font>
***继承`WKMessageContent`和定义名片消息的正文结构***
```typescript
export class CardMessageContent extends WKMessageContent {
 uid: string = ''
 name: string = ''
 
  constructor() {
    super();
    this.contentType = 16 // 指定类型
  }

}
```
***编码解码***
```typescript

  // 编码发送内容
  encodeJson(): Record<string, Object> {
    let json: Record<string, Object> = {}
    json['uid'] = this.uid
    json['name'] = this.name
    return json
  }

  // 解码内容
  decodeJson(jsonStr: string): WKMessageContent {
    let json = CommonUtil.jsonToRecord(jsonStr)
    if (json !== undefined) {
      this.uid = CommonUtil.readString(json, 'uid')
      this.name = CommonUtil.readString(json, 'name')
    }
    return this
  }

  // 最近会话显示内容
  displayText(): string {
    return '[名片]'
  }
```
***注册消息***
```typescript
// 注册自定义消息
WKIM.shared.messageManager().registerMsgContent(16, (jsonStr: string) => {
    return new CardMessageContent().decodeJson(jsonStr)
})
```

对此通过这三步自定义普通消息就已完成。在收到消息时`WKMsg`中的type为16就表示该消息是名片消息，其中`messageContent`则为自定义的`CardMessageContent`，这时可将`messageContent`强转为`CardMessageContent`并渲染到UI上

#### 自定义附件消息
`需要实现上传附件数据源` [上传附件数据源](/sdk/harmonyos.html#上传消息附件提供者)

我们在发送消息的时候有时需发送带附件的消息。WuKongIM 也提供自定义附件消息，自定义附件消息和普通消息区别不大。下面我们位置消息举例

***自定义消息结构***
值得注意的是自定义附件消息需继承`WKMediaMessageContent`而不是`WKMessageContent`
```typescript
export class LocationMessageContent extends WKMediaMessageContent {
  address: string = ''

  constructor() {
    super();
    this.contentType = 17 // 指定类型
  }

```
***编码解码***
```typescript

  // 编码
  encodeJson(): Record<string, Object> {
    let json: Record<string, Object> = {}
    json['url'] = this.url  // 位置截图url
    json['address'] = this.address
    return json
  }

  // 解码
  decodeJson(jsonStr: string): WKMessageContent {
    let json = CommonUtil.jsonToRecord(jsonStr)
    if (json !== undefined) {
      this.address = CommonUtil.readString(json, 'address')
      this.url = CommonUtil.readString(json, 'url')
    }
    return this
  }

  // 最近会话显示内容
  displayText(): string {
    return '[位置]'
  }
```
***注册消息***
```typescript
WKIM.shared.messageManager().registerMsgContent(17, (jsonStr: string) => {
    return new LocationMessageContent().decodeJson(jsonStr)
})
```
## 数据源管理

### 连接

#### 连接地址提供者
```typescript
// 连接地址提供者
WKIM.shared.config.provider.connectAddrCallback = (): Promise<string> => {
    // 通过网络获取连接地址后返回
    let add = HttpUtil.getIP()
    return add
}
```
- <font color="#999" font-size=2>返回 IM 通信端的 IP 和 IM 通信端的 TCP 端口。<font color="#FF0000">分布式可调用接口获取 IP 和 Port 后返回</font></font>

### 频道
#### 频道资料提供者
```typescript
// 频道资料提供者
WKIM.shared.config.provider.channelInfoCallback =
      async (channelId: string, channelType: number): Promise<WKChannel> => {
        // 测试数据，实际可通过接口返回
        let channel = new WKChannel(channelId, channelType)
        if (channel.channelType === WKChannelType.personal) {
          channel.channelName = `单聊${channelId}`
          channel.channelRemark = `备注${channel.channelName}`
        } else if (channel.channelType === WKChannelType.group) {
          channel.channelName = `群${channelId}`
        }
        channel.avatar = `https://api.multiavatar.com/${channel.channelId}.png`
        return channel
      }
```

### 频道成员
#### 频道成员提供者
```typescript
WKIM.shared.config.provider.channelMemberCallback = async (channelId: string, channelType: number,
    maxVersion: number): Promise<WKChannelMember[]> => {
    // 测试数据，实际可通过接口返回
    let list: WKChannelMember[] = []
    return list
}
```
#### 频道成员分页数据提供者
```typescript   
WKIM.shared.config.provider.channelMemberWithPageCallback = async (channel: WKChannel,
    option: SyncChannelMemberOptions): Promise<WKChannelMember[]>=>{
    // 测试数据，实际可通过接口返回
    let list: WKChannelMember[] = []
    return list
}
```

### 消息
#### 历史消息提供者
```typescript
// 历史消息提供者
WKIM.shared.config.provider.syncMessageCallback = async (channel: WKChannel, options: SyncOptions): Promise<WKSyncChannelMsg> => {
  // 通过接口获取历史消息并返回
}
```
#### 同步消息扩展提供者
```typescript
// 同步消息扩展提供者
WKIM.shared.config.provider.syncMessageExtraCallback = async  (channel: WKChannel, extraVersion: number,
    limit: number) : Promise<WKMsgExtra[]>=>{
    // 通过接口获取消息扩展并返回
    let list: WKMsgExtra[] = []
    return list
}
```
#### 上传消息扩展提供者
```typescript
// 上传扩展消息提供者
WKIM.shared.config.provider.uploadMessageExtraCallback =(extra: WKMsgExtra):void=>{
  // 将extra的编辑内容上传至服务器
}
```
### 最近会话
#### 同步最近会话提供者
```typescript
WKIM.shared.config.provider.syncConversationCallback = async (lastMsgSeqs: string, msgCount: number,
version: number): Promise<WKSyncConversation> => {
// 通过接口获取最近会话并返回
}
```
#### 同步最近会话扩展提供者
```typescript
WKIM.shared.config.provider.syncConversationExtraCallback = async (version: number) : Promise<WKConversationExtra[]> =>{
    // 通过接口获取最近会话扩展并返回
    let list:WKConversationExtra[]=[]
    return list
      }
```
### 附件
#### 上传消息附件提供者
```typescript
// 下载附件提供者
WKIM.shared.config.provider.uploadAttachmentCallback =async (msg: WKMsg): Promise<[boolean, WKMsg]> => {
    // 模拟上传
  if (msg.contentType === WKMsgContentType.Image) {
    // 上传图片
    let imageContent = msg.messageContent as WKImageContent
    imageContent.url = 'xxxx'
    msg.messageContent = imageContent
    return [true, msg]
  } else if (msg.contentType === WKMsgContentType.Voice) {
    // 上传语音
    let voiceContent = msg.messageContent as WKVoiceContent
    voiceContent.url = 'xxxx'
    msg.messageContent = voiceContent
    return [true, msg]
  } else if (msg.contentType === WKMsgContentType.Video) {
    // 上传视频
    let videoContent = msg.messageContent as WKVideoContent
    videoContent.url = 'xxxx'
    msg.messageContent = videoContent
    return [true, msg]
  } else if (msg.contentType === 17) {
    // 上传自定义附件消息
    let customerMsg = msg.messageContent as LocationMessageContent
    customerMsg.url = 'https://img1.baidu.com/it/u=3362698628,1928330748&fm=253&fmt=auto&app=138&f=JPEG?w=390&h=308'
    msg.messageContent = customerMsg
    return [true, msg]
  }
  return [true, msg]
}
```
### 提醒项
#### 提醒项提供者
```typescript
// 提醒项提供者
WKIM.shared.config.provider.syncReminderCallback = async (version: number): Promise<WKReminder[]> => {
// 通过接口获取提醒项并返回
    let list: WKReminder[] = []
    return list
}
```


