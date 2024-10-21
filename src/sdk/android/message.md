# 消息管理


### 发送消息

`Java`

```java
/**
*
* @param textContent 消息正文
* @param channelID 投递的频道ID
* @param channelType 投递的频道类型（个人频道，群频道，客服频道等等）
*/
WKIM.getInstance().getMsgManager().sendMessage(textContent,channelID, channelType);
```

`Kotlin`

```kotlin
WKIM.getInstance().msgManager.send(textContent,channel)
```

- <font size=2 color="#999">sdk 内置频道类型可通过`WKChannelType`查看</font>

#### 文本消息

`Java`

```java
// 定义文本消息
WKTextContent textContent = new WKTextContent("你好，悟空");
// 发送消息
WKIM.getInstance().msgManager.send(textContent,channel)
```
`Kotlin`

```kotlin
// 定义文本消息
val textContent = WKTextContent("你好，悟空")
// 发送消息
WKIM.getInstance().msgManager.send(textContent,channel)
```

#### 图片消息

```java
// 定义图片消息
WKImageContent imageContent = new WKImageContent(localPath);
// 发送消息
WKIM.getInstance().msgManager.send(imageContent,channel);
```
`Kotlin`

```kotlin
// 定义图片消息
val imageContent = WKImageContent(localPath)
// 发送消息
WKIM.getInstance().msgManager.send(imageContent,channel)
```
- <font color="#999" size=2>在构建图片消息正文时，无需传递图片的高宽。sdk 会自动获取图片高宽</font>

#### 自定义消息

参考自定义消息: [自定义消息](/sdk/android/advance.html#自定义消息)

### 消息入库返回（并不是消息发送状态）

在发送消息时，sdk 将消息保存在本地数据库后就会触发入库回调。此时消息并未进行发送，可在此监听中将消息展示在 UI 上

`Java`

```java
WKIM.getInstance().getMsgManager().addOnSendMsgCallback("key", new ISendMsgCallBackListener() {
            @Override
            public void onInsertMsg(WKMsg wkMsg) {
                // 可以在这里将保存在数据库的消息`wkMsg`展示在UI上
                // ...
            }
        });
```

`Kotlin`

```kotlin
WKIM.getInstance().msgManager.addOnSendMsgCallback("key") { wkMsg ->
     // 将消息wkMsg展示在UI上
    }
```

- <font color='#999' size=2>关于事件是否传入唯一 key 说明请查看[事件监听](/sdk/android#说明)</font>

### 收到新消息监听

`Java`

```java
// 添加监听
WKIM.getInstance().getMsgManager().addOnNewMsgListener("key", new INewMsgListener() {
            @Override
            public void newMsg(List<WKMsg> list) {
                // list:接收到的消息
            }
        });
// 退出页面时移除监听
WKIM.getInstance().getMsgManager().removeNewMsgListener("key");
```

`Kotlin`

```kotlin
// 添加监听
WKIM.getInstance().msgManager.addOnNewMsgListener("key") { list ->
          // list:接收到的消息
}

// 退出页面时移除监听
WKIM.getInstance().msgManager.removeNewMsgListener("key")
```

- <font color='#999' size=2>如果在聊天页面内收到新消息时需判断该消息是否属于当前会话，可通过消息对象`WKMsg`的`channelID`和`channelType`判断</font>

### 刷新消息监听

在 sdk 更新过消息时，如：消息发送状态，有人点赞消息，消息已读回执，消息撤回，消息被编辑等等，sdk 都将回调以下事件。UI 可通过消息对象`WKMsg`的`clientMsgNO`来判断具体是哪条消息发生了更改。

`Java`

```java
// 添加刷新监听
WKIM.getInstance().getMsgManager().addOnRefreshMsgListener("key", new IRefreshMsg() {
            @Override
            public void onRefresh(WKMsg wkMsg, boolean isEnd) {
                // wkMsg：刷新的消息对象
                // isEnd：为了避免频繁刷新UI导致卡顿，当isEnd为true时在刷新UI
            }
        });

// 退出页面时移除刷新监听
WKIM.getInstance().getMsgManager().removeRefreshMsgListener("key");
```

`Kotlin`

```kotlin
// 添加刷新监听
WKIM.getInstance().msgManager.addOnRefreshMsgListener("") { wkMsg, isEnd ->
   // wkMsg：刷新的消息对象
  // isEnd：为了避免频繁刷新UI导致卡顿，当isEnd为true时在刷新UI
}

// 退出页面时移除刷新监听
WKIM.getInstance().msgManager.removeRefreshMsgListener("key")
```


### 查看某个频道的聊天信息

`Java`

```java
/**
  * 查询或同步某个频道消息
  *
  * @param channelId                频道ID
  * @param channelType              频道类型
  * @param oldestOrderSeq           最后一次消息大orderSeq 第一次进入聊天传入0
  * @param contain                  是否包含 oldestOrderSeq 这条消息
  * @param dropDown                 是否下拉
  * @param aroundMsgOrderSeq        查询此消息附近消息 如 aroundMsgOrderSeq=20 返回数据则是 [16,17,19,20,21,22,23,24,25]
  * @param limit                    每次获取数量
  * @param iGetOrSyncHistoryMsgBack 请求返还
  */
WKIM.getInstance().getMsgManager().getOrSyncHistoryMessages(String channelId, byte channelType, long oldestOrderSeq, boolean contain, boolean dropDown, int limit, long aroundMsgOrderSeq, final IGetOrSyncHistoryMsgBack iGetOrSyncHistoryMsgBack) {

}
```

`Kotlin`

```kotlin
WKIM.getInstance().msgManager.getOrSyncHistoryMessages(channelId,channelType,oldestOrderSeq,contain,dropDown,limit,aroundMsgOrderSeq,object :IGetOrSyncHistoryMsgBack{
            override fun onResult(list: MutableList<WKMsg>?) {
                // list 获取到的消息 展示到UI
            }
        })
```

- <font color='#999' size=2>获取历史消息并不是同步方法，因为有可能存在非连续性时会往服务器同步数据</font>

代码
```java
  WKIM.getInstance().getMsgManager().getOrSyncHistoryMessages(channelId, channelType, oldestOrderSeq, contain, pullMode, limit, aroundMsgOrderSeq, new IGetOrSyncHistoryMsgBack() {
            @Override
            public void onSyncing() {
                // 正在同步中 按需显示loading
            }

            @Override
            public void onResult(List<WKMsg> list) {
                // 展示消息
            }
        });
```

### 离线消息接收
`需要实现同步频道消息数据源` [频道消息数据源](/sdk/android/datasource.html#频道消息数据源)

因为WuKongIM 是支持消息永久存储，所以会产生海量的离线消息。对此我们采用了按需拉取的机制，如 10 个会话一个会话 10 万条消息，WuKongIM 不会把这个 10\*10 万=100 万条消息都拉取到本地。 而是采用拉取这 10 个会话的信息和对应的最新 20 条消息，也就是实际只拉取了 200 条消息 相对 100 万条消息来说大大提高了离线拉取速度。用户点进对应的会话才会去按需拉取这个会话的消息。 这些机制 SDK 内部都已做好了封装，使用者其实不需要关心。使用者只需要关心最近会话的变化和监听获取数据的回调即可。

### 数据结构说明

#### 消息类核心属性

```java
public class WKMsg {
  // 服务器消息ID(全局唯一，无序)
  public String messageID;
  // 本地唯一ID
  public String clientMsgNO;
  // 服务器时间 (10位时间戳)
  public long timestamp;
  // 消息来源发送者
  public String fromUID;
  // 聊天频道ID
  public String channelID;
  // 聊天频道类型
  public byte channelType;
  // 消息正文
  public WKMessageContent baseContentMsgModel;
  // 消息头
  public WKMsgHeader header;
  // 本地扩展字段
  public HashMap localExtraMap;
  // 远程扩展
  public WKMsgExtra remoteExtra;
  ...
}
```

#### 消息正文核心属性

```java
public class WKMessageContent {
  // 消息内容类型
  public int type;
  // 消息中的@提醒信息
  public WKMentionInfo mentionInfo;
  // 消息回复对象
  public WKReply reply;
  // 编码消息 上层需实现该方法并编码
  public JSONObject encodeMsg() {
      return new JSONObject();
  }
  // 解码消息 上层需实现该方法并解码
  public WKMessageContent decodeMsg(JSONObject jsonObject) {
      return this;
  }
  ...
}
```