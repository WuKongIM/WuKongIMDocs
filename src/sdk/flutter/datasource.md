# 数据源管理

### 文件
在自定义附件消息的时候发送给对方的消息是将网络地址发送给对方，并不是实际的文件。这个时候我们就需监听附件的上传

#### 监听上传附件
```dart
 // 监听上传消息附件
    WKIM.shared.messageManager.addOnUploadAttachmentListener((wkMsg, back) {
      if (wkMsg.contentType == WkMessageContentType.image) {
        // todo 上传附件
        WKImageContent imageContent = wkMsg.messageContent! as WKImageContent;
        imageContent.url = 'xxxxxx';
        wkMsg.messageContent = imageContent;
        back(wkMsg);
      }
      if (wkMsg.contentType == WkMessageContentType.voice) {
        // todo 上传语音
        WKVoiceContent voiceContent = wkMsg.messageContent! as WKVoiceContent;
        voiceContent.url = 'xxxxxx';
        wkMsg.messageContent = voiceContent;
        back(wkMsg);
      } else if (wkMsg.contentType == WkMessageContentType.video) {
        WKVideoContent videoContent = wkMsg.messageContent! as WKVideoContent;
        // todo 上传封面及视频
        videoContent.cover = 'xxxxxx';
        videoContent.url = 'ssssss';
        wkMsg.messageContent = videoContent;
        back(wkMsg);
      }
    });
```

#### 附件下载

sdk 中不会主动下载消息的附件。在收到带有附件的消息时需要 应用 自己按需下载。在 应用 下载完成后可改文件本地地址，避免重复下载

```dart
/**
  * 修改消息内容体
  *
  * @param clientMsgNo       客户端消息ID
  * @param messageContent    消息module 将本地地址保存在 messageContent 中
  * @param isRefreshUI       是否通知UI刷新对应消息
  */
WKIM.shared.messageManager.updateContent(String clientMsgNo, WKMessageContent messageContent, boolean isRefreshUI);
```

### 最近会话
#### 监听同步会话
```dart
WKIM.shared.conversationManager
        .addOnSyncConversationListener((lastSsgSeqs, msgCount, version, back) {
        /**
            * 同步会话
            *
            * @param lastSsgSeqs     最近会话列表msg_seq集合
            * @param msgCount        会话里面消息同步数量
            * @param version         最大版本号
            * @param back            回调
            */
            // 需要请求业务接口将数据返回给sdk
            back(conversation);
    });
```

### 频道
#### 频道资料数据源
```dart
//  监听获取channel信息
WKIM.shared.channelManager.addOnGetChannelListener((channelId, channelType, back) {
    // 获取到资料后 通过back返回
    // 或调用 WKIM.shared.channelManager.addOrUpdateChannel()方法更新sdk中channel资料
});
```

也可以批量保存频道资料信息
```dart
// 批量保存频道资料信息
WKIM.shared.channelManager.addOrUpdateChannels(channels);
```

### 消息
#### 频道消息数据源
```dart
WKIM.shared.messageManager.addOnSyncChannelMsgListener((channelID,
        channelType, startMessageSeq, endMessageSeq, limit, pullMode, back) {
        /*
        * 同步某个频道的消息
        *
        * @param channelID           频道ID
        * @param channelType         频道类型
        * @param startMessageSeq     开始消息列号（结果包含start_message_seq的消息）
        * @param endMessageSeq       结束消息列号（结果不包含end_message_seq的消息）
        * @param limit               消息数量限制
        * @param pullMode            拉取模式 0:向下拉取 1:向上拉取
        * @param iSyncChannelMsgBack 请求返回
        */
        // todo 请求接口后需返回给sdk
    });
```