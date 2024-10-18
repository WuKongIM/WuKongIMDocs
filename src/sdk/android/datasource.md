# 数据源管理

### 文件
在自定义附件消息的时候发送给对方的消息是将网络地址发送给对方，并不是实际的文件。这个时候我们就需监听附件的上传

#### 监听上传附件

`Java`

```java
WKIM.getInstance().getMsgManager().addOnUploadAttachListener(new IUploadAttachmentListener() {
            @Override
            public void onUploadAttachmentListener(WKMsg wkMsg, IUploadAttacResultListener listener) {
                // 在这里将未上传的文件上传到服务器并返回给sdk
                if(wkMsg.type == WKMsgContentType.WK_IMAGE){
                    WKMediaMessageContent mediaMessageContent = (WKMediaMessageContent) wkMsg.baseContentMsgModel;
                    if (TextUtils.isEmpty(mediaMessageContent.url)) {
                        // todo 上传文件
                        // ...
                        mediaMessageContent.url = "xxxxxx"; // 设置网络地址并返回给sdk
                        listener.onUploadResult(true, mediaMessageContent);
                    }
                }
            }
        });
```

`Kotlin`

```kotlin
WKIM.getInstance().msgManager.addOnUploadAttachListener { wkMsg, listener ->
    // 在这里将未上传的文件上传到服务器并返回给sdk
    if (wkMsg.type == WKMsgContentType.WK_IMAGE) {
        val mediaMessageContent = wkMsg.baseContentMsgModel as WKMediaMessageContent
        if (TextUtils.isEmpty(mediaMessageContent.url)) {
            // todo 上传文件
            // ...
            mediaMessageContent.url = "xxxxxx" // 设置网络地址并返回给sdk
            listener.onUploadResult(true, mediaMessageContent)
        }
    }
}
```
#### 监听下载附件

sdk 中不会主动下载消息的附件。在收到带有附件的消息时需要 app 自己按需下载。在 app 下载完成后可改文件本地地址，避免重复下载

`Java`

```java
/**
  * 修改消息内容体
  *
  * @param clientMsgNo       客户端消息ID
  * @param messageContent    消息module 将本地地址保存在 messageContent 中
  * @param isRefreshUI       是否通知UI刷新对应消息
  */
WKIM.getInstance().getMsgManager().updateContent(String clientMsgNo, WKMessageContent messageContent, boolean isRefreshUI);
```

`Kotlin`

```kotlin
WKIMWKIM.getInstance().msgManager.updateContent(clientMsgNo,  messageContent)
```
### 最近会话

#### 最近会话数据源

`Java`

```java
WKIM.getInstance().getConversationManager().addOnSyncConversationListener(new ISyncConversationChat() {
            @Override
            public void syncConversationChat(String last_msg_seqs, int msg_count, long version, ISyncConversationChatBack iSyncConversationChatBack) {
               /**
                * 同步会话
                *
                * @param last_msg_seqs     最近会话列表msg_seq集合
                * @param msg_count         会话里面消息同步数量
                * @param version           最大版本号
                * @param iSyncConvChatBack 回调
                */
               // 需要请求业务接口将数据返回给sdk
            }
        });
```

`Kotlin`

```kotlin
WKIM.getInstance().conversationManager.addOnSyncConversationListener { last_msg_seqs, msg_count, version, iSyncConversationChatBack ->
    // todo 同步最近会话数据
}
```

### 频道
#### 频道资料数据源

`Java`

```java
// 监听获取channel信息
WKIM.getInstance().getChannelManager().addOnGetChannelInfoListener(new IGetChannelInfo() {
            @Override
            public WKChannel onGetChannelInfo(String channelID, byte channelType, IChannelInfoListener iChannelInfoListener) {
              // 获取个人资料还是群资料可通过 channelType 区分
              // 如果app本地有该channel信息可直接返回数据，反之可获取网络数据后通过 iChannelInfoListener 返回
                return null;
            }
        });
```

`Kotlin`

```kotlin
// 监听获取channel信息
WKIM.getInstance().channelManager.addOnGetChannelInfoListener { channelID, channelType, iChannelInfoListener ->
    // 获取个人资料还是群资料可通过 channelType 区分
    // 如果app本地有该channel信息可直接返回数据，反之可获取网络数据后通过 iChannelInfoListener 返回
    null
}
```

- <font color='#999' size=2>SDK 内置频道类型 可通过 `WKChannelType` 查看</font>

也可以批量保存频道资料信息
`java`
```java
// 批量保存频道资料信息
WKIM.getInstance().getChannelManager().saveOrUpdateChannels(channels);
```
`kotlin`
```kotlin
// 批量保存频道资料信息
WKIM.getInstance().channelManager.saveOrUpdateChannels(channels)
```
### 频道成员
#### 频道成员数据源

`Java`

```java
// 监听获取频道成员信息
WKIM.getInstance().getChannelMembersManager().addOnGetChannelMembersListener((channelID, b, keyword, page, limit, iChannelMemberListResult) ->{
    // 获取频道成员后通过 iChannelMembersListener 返回给sdk
});
```

`Kotlin`

```kotlin
// 监听获取频道成员信息
  WKIM.getInstance().channelMembersManager.addOnGetChannelMembersListener { channelID, channelType, keyword, page, limit, back ->
           // 获取频道成员后通过 iChannelMembersListener 返回给sdk
        }
```

### 消息
#### 频道消息数据源

`Java`

```java
WKIM.getInstance().getMsgManager().addOnSyncChannelMsgListener(new ISyncChannelMsgListener() {
            @Override
            public void syncChannelMsgs(String channelID, byte channelType,long startMessageSeq, long endMessageSeq, int limit, int pullMode, ISyncChannelMsgBack iSyncChannelMsgBack) {
                /**
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
            }
        });
```

`Kotlin`

```kotlin
WKIM.getInstance().msgManager.addOnSyncChannelMsgListener { channelID, channelType, startMessageSeq, endMessageSeq, limit, pullMode, iSyncChannelMsgBack ->
     // 调用接口获取channel历史消息
     // do ...
}
```