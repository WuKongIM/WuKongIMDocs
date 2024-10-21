# 数据源管理

### 文件
在自定义附件消息的时候发送给对方的消息是将网络地址发送给对方，并不是实际的文件。这个时候我们就需监听附件的上传
#### 上传
```typescript
// 定义上传文件数据源
let uploadAttachmentCallback = async (msg: WKMsg): Promise<[boolean, WKMsg]> => {
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

// 提供文件上传数据源
WKIM.shared.config.provider.uploadAttachmentCallback = uploadAttachmentCallback

```

#### 下载
sdk 中不会主动下载消息的附件。在收到带有附件的消息时需要 app 自己按需下载。在 app 下载完成后可改文件本地地址，避免重复下载
```typescript
WKIM.shared.messageManager().updateContent(clientMsgNo: string, messageContent: WKMessageContent)
```

### 最近会话

#### 同步最近会话数据源
```typescript
// 定义提供者
let syncConversationCallback = async (lastMsgSeqs: string, msgCount: number,
  version: number): Promise<WKSyncConversation> => {
    // do 请求接口后返回给sdk
}

// 设置同步最近会话提供者
WKIM.shared.config.provider.syncConversationCallback = syncConversationCallback
    
```

### 频道
#### 频道资料数据源
```typescript 
// 设置频道资料提供者
WKIM.shared.config.provider.channelInfoCallback =
    async (channelId: string, channelType: number): Promise<WKChannel> => {
    // 测试数据，实际可通过接口返回
    WKLogger.error('获取channel资料', channelId, channelType + "")
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
#### 频道成员分页数据源
```typescript
// 定义提供者
WKIM.shared.config.provider.channelMemberWithPageCallback = async (channel: WKChannel,
      option: SyncChannelMemberOptions): Promise<WKChannelMember[]> => {
        // todo 请求接口后返回给sdk
      let list: WKChannelMember[] = []
      return list
    }
```

### 消息
#### 频道消息数据源

```typescript
// 定义提供者
let syncMessageCallback = async (channel: WKChannel, options: SyncOptions): Promise<WKSyncChannelMsg> => {
     /*
        * 同步某个频道的消息
        *
        * @param channel.channelId           频道ID
        * @param channel.channelType         频道类型
        * @param options.startMessageSeq     开始消息列号（结果包含start_message_seq的消息）
        * @param options.endMessageSeq       结束消息列号（结果不包含end_message_seq的消息）
        * @param options.limit               消息数量限制
        * @param options.pullMode            拉取模式 0:向下拉取 1:向上拉取
        */
        // todo 请求接口后需返回给sdk
}

// 同步channel消息
WKIM.shared.config.provider.syncMessageCallback = syncMessageCallback
```