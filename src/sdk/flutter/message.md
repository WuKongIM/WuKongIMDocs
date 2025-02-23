# 消息管理


### 发送消息

```dart
WKIM.shared.messageManager.sendMessage(WKTextContent('我是文本消息'), WKChannel('uid_1', WKChannelType.personal));
```

#### 文本消息
```dart
// 定义文本消息
WKTextContent text = WKTextContent("你好，悟空");
// 发送文本消息
WKIM.shared.messageManager.sendMessage(text,channel);
```

#### 图片消息
```dart
// 定义图片消息
WKImageContent image = WKImageContent(100, 100);
image.localPath = "xxx"; // 图片本地路径
image.url = "http://xxx.com/xxx.jpg"
// 发送图片消息
WKIM.shared.messageManager.sendMessage(image,channel);
```

#### 自定义消息

参考自定义消息: [自定义消息](/sdk/flutter/advance.html#自定义消息)


### 消息入库返回（并不是消息发送状态）
在发送消息时，sdk 将消息保存在本地数据库后就会触发入库回调。此时消息并未进行发送，可在此监听中将消息展示在 UI 上

监听消息入库事件
```dart
WKIM.shared.messageManager.addOnMsgInsertedListener((wkMsg) {
      // 展示在UI
    });
```

### 新消息
监听新消息事件

```dart
// 监听新消息事件
WKIM.shared.messageManager.addOnNewMsgListener('chat', (msgs) {
      //  展示在UI上
    });

// 移除新消息监听
WKIM.shared.messageManager.removeNewMsgListener('chat');
```
- <font color='#999' size=2>如果在聊天页面内收到新消息时需判断该消息是否属于当前会话，可通过消息对象`WKMsg`的`channelID`和`channelType`判断</font>


### 刷新消息监听

在 sdk 更新过消息时，如：消息发送状态，有人点赞消息，消息已读回执，消息撤回，消息被编辑等等，sdk 都将回调以下事件。UI 可通过消息对象`WKMsg`的`clientMsgNO`来判断具体是哪条消息发生了更改。

监听刷新消息事件
```dart
// 监听刷新消息事件
WKIM.shared.messageManager.addOnRefreshMsgListener('chat', (wkMsg) {
      // todo 刷新消息
    });

// 移除刷新消息监听
WKIM.shared.messageManager.removeOnRefreshMsgListener('chat');
```

### 查看某个频道的聊天信息
```dart
/*
    * 查询或同步某个频道消息
    *
    * @param channelId                频道ID
    * @param channelType              频道类型
    * @param oldestOrderSeq           最后一次消息大orderSeq 第一次进入聊天传入0
    * @param contain                  是否包含 oldestOrderSeq 这条消息
    * @param pullMode                 拉取模式 0:向下拉取 1:向上拉取
    * @param aroundMsgOrderSeq        查询此消息附近消息 如 aroundMsgOrderSeq=20 返回数据则是 [16,17,19,20,21,22,23,24,25]
    * @param limit                    每次获取数量
    * @param iGetOrSyncHistoryMsgBack 请求返还
    * @param syncBack 同步消息时回掉，可通过此回掉显示加载中
    */
WKIM.shared.messageManager.getOrSyncHistoryMessages(
        channelID, channelType, oldestOrderSeq, contain, pullMode, limit, aroundMsgOrderSeq,  Function(List<WKMsg>)){
            
        },Function() syncBack);
```

- <font color='#999' size=2>获取历史消息并不是同步方法，因为有可能存在非连续性时会往服务器同步数据</font>

### 离线消息
`需要实现同步频道消息数据源` [频道消息数据源](/sdk/flutter/datasource.html#频道消息数据源)

因为WuKongIM 是支持消息永久存储，所以会产生海量的离线消息。对此我们采用了按需拉取的机制，如 10 个会话一个会话 10 万条消息，WuKongIM 不会把这个 10\*10 万=100 万条消息都拉取到本地。 而是采用拉取这 10 个会话的信息和对应的最新 20 条消息，也就是实际只拉取了 200 条消息 相对 100 万条消息来说大大提高了离线拉取速度。用户点进对应的会话才会去按需拉取这个会话的消息。 这些机制 SDK 内部都已做好了封装，使用者其实不需要关心。使用者只需要关心最近会话的变化和监听获取数据的回调即可。

### 数据结构说明

#### 消息类核心属性
```dart
class WKMsg {
  // 消息头 redDot：是否显示红点 noPersist：是否不存储 syncOnce：是否只同步一次
  MessageHeader header = MessageHeader();
  // 消息设置  receipt：是否回执，topic：是否话题聊天，stream：是否流消息;
  Setting setting = Setting();
  // 服务器消息ID(全局唯一，无序)
  String messageID = "";
  // 服务器消息ID(有序)
  int messageSeq = 0;
  // 本地消息有序ID
  int clientSeq = 0;
  // 10位时间戳
  int timestamp = 0;
  // 本地唯一ID
  String clientMsgNO = "";
  // 发送者
  String fromUID = "";
  // 所属频道ID
  String channelID = "";
  // 所属频道类型
  int channelType = WKChannelType.personal;
  // 消息正文类型 如 1:【文本】2:【图片】...
  int contentType = 0;
  // 消息负载
  String content = "";
  // 消息状态 0.发送中 1.成功
  int status = 0;
  // 是否被删除 1.是
  int isDeleted = 0;
  // 发送者的资料 
  WKChannel? _from;
  // 所属频道资料
  WKChannel? _channelInfo;
  // 发送者在频道内类型资料（群消息才有值）
  WKChannelMember? _memberOfFrom;
  // 排序号
  int orderSeq = 0;
  // 本地扩展字段
  dynamic localExtraMap;
  // 远程扩展字段，服务器维护
  WKMsgExtra? wkMsgExtra;
  // 本条消息回应数据
  List<WKMsgReaction>? reactionList;
  // 消息正文体 contentType==1.WKTextContent contentType==2.WKImageConent
  WKMessageContent? messageContent;
}
```

#### 消息正文体
```dart
class WKMessageContent {
    // 消息类型 1.文本 2.图片 
  var contentType = 0;
  // 消息内容
  String content = "";
  // 回复消息
  WKReply? reply;
  // 消息内容渲染数据
  List<WKMsgEntity>? entities;
  // 提醒信息
  WKMentionInfo? mentionInfo;
}
```