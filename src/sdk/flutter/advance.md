# 高级功能

### 自定义消息类型

在WuKongIM 中所有的消息类型都是自定义消息。下面我们以`gif`消息举例

#### 第一步 定义消息

定义消息对象并继承 `WKMessageContent` 并在构造方法中指定消息类型

- <font color='#999' size=2>SDK 内置消息类型可通过 `WkMessageContentType` 查看</font>

  **继承 `WKMessageContent` 和定义 gif 消息的正文结构**
```dart
class GifContent extends WKMessageContent{
    int width=0; // 宽度
    int height=0; // 高度
    String url; // 远程地址
    GifContent(this.url){
        // 指定消息类型
        contentType = WkMessageContentType.gif;
    }
}
```
#### 第二步 编码解码
```dart
class GifContent extends WKMessageContent{
    int c=0; // 宽度
    int height=0; // 高度
    String url; // 远程地址
    GifContent(this.url){
        // 指定消息类型
        contentType = WkMessageContentType.gif;
    }

  @override
  WKMessageContent decodeJson(Map<String, dynamic> json) {
    url = readString(json, 'url');
    width = readInt(json, 'width');
    height = readInt(json, 'height');
    return this;
  }

  @override
  Map<String, dynamic> encodeJson() {
    return {'url': url, 'width': width, 'height': height};
  }
 // 如果需要获取可显示内容可重写

  @override
  String displayText() {
    return "[动态图片]";
  }
}
```
- <font color='#999' size=2>解码和编码消息时无需将 `type` 字段考虑其中，sdk 内部会自动处理</font>

#### 第三步 注册消息
```dart
WKIM.shared.messageManager.registerMsgContent(WkMessageContentType.gif,
        (dynamic data) {
      return GifContent('').decodeJson(data);
    });
```

对此通过这三步自定义普通消息就已完成。在收到消息时`WKMsg`中的type为3就表示该消息是名片消息，其中`messageContent`则为自定义的`GifContent`，这时可将`messageContent`强转为`GifContent`并渲染到UI上

### 自定义附件消息

我们在发送消息的时候有时需发送带附件的消息。WuKongIM 也提供自定义附件消息，自定义附件消息和普通消息区别不大。下面我们图片消息举例

#### 第一步 定义消息

值得注意的是自定义附件消息需继承`WKMediaMessageContent`而不是`WKMessageContent`


```dart

class WKImageContent extends WKMediaMessageContent {
  int width; // 图片宽度
  int height; // 图片高度
  WKImageContent(this.width, this.height) {
    contentType = WkMessageContentType.image;
  }
}
```

#### 第二步 编码解码
```dart
class WKImageContent extends WKMediaMessageContent {
  int width; // 图片宽度
  int height; // 图片高度
  WKImageContent(this.width, this.height) {
    contentType = WkMessageContentType.image;
  }

  @override
  Map<String, dynamic> encodeJson() {
    return {'width': width, 'height': height, 'url': url};
  }

  @override
  WKMessageContent decodeJson(Map<String, dynamic> json) {
    width = readInt(json, 'width');
    height = readInt(json, 'height');
    url = readString(json, 'url');
    localPath = readString(json, 'localPath');
    return this;
  }

}
```
#### 第三步 注册消息
```dart
WKIM.shared.messageManager.registerMsgContent(WkMessageContentType.image,
        (dynamic data) {
      return WKImageContent(
        0,
        0,
      ).decodeJson(data);
    });
```

### 消息扩展

随着业务的发展应用在聊天中的功能也日益增多，为了满足绝大部分的需求 WuKongIM 中增加了消息扩展功能。消息扩展分`本地扩展`和`远程扩展`，本地扩展只针对 app 本地使用卸载 app 后将丢失，远程扩展是服务器保存卸载重装后数据将恢复

#### 本地扩展

本地扩展就是消息对象`WKMsg`中的`localExtraMap`字段
```dart
// 修改消息本地扩展
WKIM.shared.messageManager.updateLocalExtraWithClientMsgNo(String clientMsgNo,dynamic data);
```
- <font color='#999' size=2>更新成功后 sdk 会触发刷新消息回调</font>

#### 远程扩展

远程扩展就是消息对象`WKMsg`中的`wkMsgExtra`字段
```dart
// 修改消息远程扩展
WKIM.shared.messageManager.saveRemoteExtraMsg(List<WKSyncExtraMsg> list);
```

### 消息已读未读
消息的已读未读又称消息回执。消息回执功能可通过 setting 进行设置
#### 发送回执消息
```dart 
Setting setting = Setting();
setting.receipt = 1; //开启回执
var option = WKSendOptions();
option.setting = setting;
// 发送消息
WKIM.shared.messageManager.sendWithOption(
    text, WKChannel(channelID, channelType), option);
```
当用户浏览过对方发送的消息时，如果对方开启了消息回执这时需将查看过的消息上传到服务器标记该消息已读。当对方或者自己上传过已读消息这时服务器会下发同步消息扩展的 cmd(命令)消息,此时需同步最新消息扩展通过`WKIM.shared.messageManager.saveRemoteExtraMsg(List<WKSyncExtraMsg> list)`方法保存到 sdk 中

### 消息回复
在聊天中如果消息过多，发送消息回复就会显得消息很乱无章可循。这时就需要对某条消息进行特定的回复，即消息回复。 如以下效果

<img src='./../msg_reply.jpg' width=30%/>

在发送消息时，只需将消息正文`WKMessageContent`中的`WKReply`对象赋值就能对达到消息回复效果
#### 发送回复消息
```dart
// 回复
WKTextContent text = WKTextContent(content);
WKReply reply = WKReply();
reply.messageId = "11";
reply.rootMid = "111";
reply.fromUID = "11";
reply.fromName = "12";
WKTextContent payloadText = WKTextContent("dds");
reply.payload = payloadText;
text.reply = reply;
// 发送消息 
WKIM.shared.messageManager.sendMessage( text, WKChannel(channelID, channelType));
```

### 消息回应（点赞）

当自己或者别人对消息回应(点赞)时，都会触发 cmd(命令)消息通知到应用。应用在收到同步消息回应的cmd时获取可调用服务器同步接口将获取的回应数据更新到sdk
```dart
// 保存消息回应
WKIM.shared.messageManager.saveMessageReactions(List<WKSyncMsgReaction> list);
```

- <font color='#999' size=2>同一个用户对同一条消息只能做出一条回应。重复进行消息不同 emoji 的回应会做为修改回应，重复进行相同 emoji 的回应则做为删除回应</font> sdk 更新消息回应后会触发消息刷新的事件。app 需监听此事件并对 UI 进行刷新

### 消息编辑

当我们给对方发送消息发现发送内容有错误时，这时无需撤回重发只需要将消息编辑即可

#### 设置编辑内容
```dart
WKIM.shared.messageManager.updateMsgEdit(String messageID, String channelID, int channelType,
      String content);
```
更改 sdk 消息编辑内容后需将编辑后的内容上传到服务器,则需要监听上传消息扩展

#### 监听上传消息扩展
```dart
WKIM.shared.messageManager.addOnUploadMsgExtra((wkMsgExtra) => {
        // 上传到自己的服务器
    });
```
如果自己或者别人编辑了消息，都会触发 cmd(命令)消息，app根据cmd类型判断后去同步消息扩展即可 app 需监听消息更新的事件完成对 UI 的刷新
