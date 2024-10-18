# 频道管理

频道(Channel)WuKongIM 中是一个比较抽象的概念。发送消息都是先发送给频道，频道根据自己的配置规则进行投递消息，频道分频道和频道详情。 更多介绍请移步[什么是频道](/guide/initialize#频道)

### 数据源

`需要实现获取频道资料的数据源` [获取频道资料数据源](/sdk/android/datasource.html#频道资料数据源)
### 频道资料
#### 获取频道资料

`Java`

```java
// 获取channel信息 先获取内存 如果没有再从数据库获取
WKIM.getInstance().getChannelManager().getChannel(String channelID, byte channelType)
```

`Kotlin`

```kotlin
// 获取channel信息 先获取内存 如果没有再从数据库获取
WKIM.getInstance().channelManager.getChannel(channelID,channelType)
```
#### 强制刷新频道资料

`Java`

```java
// 从远程服务器获取channel信息
WKIM.getInstance().getChannelManager().fetchChannelInfo(String channelID, byte channelType)
```

`Kotlin`

```kotlin
// 从远程服务器获取channel信息
WKIM.getInstance().channelManager.fetchChannelInfo(channelID,channelType)
```

### 事件
#### 刷新频道资料

`Java`

```java
// 监听channel刷新事件
WKIM.getInstance().getChannelManager().addOnRefreshChannelInfo("key", new IRefreshChannel() {
            @Override
            public void onRefreshChannel(WKChannel channel, boolean isEnd) {
                //
            }
        });

// 移除监听
WKIM.getInstance().getChannelManager().removeRefreshChannelInfo("key");
```

`Kotlin`

```kotlin
// 监听channel刷新事件
WKIM.getInstance().channelManager.addOnRefreshChannelInfo("key", object : IRefreshChannel {
            override fun onRefreshChannel(channel: WKChannel, isEnd: Boolean) {
                //
            }
        })

// 移除监听
WKIM.getInstance().channelManager.removeRefreshChannelInfo("key");
```

- <font color='#999' size=2>注：key为监听的唯一标识，可以为任意字符串，添加监听和移出监听时需要传入相同的key</font>

#### 频道头像更新
`java`
```java
// 监听频道头像更新事件
WKIM.getInstance().getChannelManager().addOnRefreshChannelAvatar( new IRefreshChannelAvatar() {
            @Override
            public void onRefreshChannelAvatar(String channelID, byte channelType) {
                // 头像需要本地修改
                String key = UUID.randomUUID().toString().replace("-", "");
                WKIM.getInstance().getChannelManager().updateAvatarCacheKey(s, b, key);
            }
        });
```
`kotlin`
```kotlin
// 监听频道头像更新事件
WKIM.getInstance().channelManager.addOnUpdateChannelAvatar("key", object : IRefreshChannelAvatar {
            override fun onRefreshChannelAvatar(channelID: String, channelType: Int) {
                //
            }
        })

// 移除监听
WKIM.getInstance().channelManager.removeUpdateChannelAvatar("key");
```

### 常用方法
#### 修改备注

`Java`

```java
// 修改频道备注
WKIM.getInstance().getChannelManager().updateRemark(String channelID, byte channelType, String remark)
```

`Kotlin`

```kotlin
// 修改频道备注
WKIM.getInstance().channelManager.updateRemark(channelID, channelType, remark)
```

#### 置顶/取消置顶

`Java`

```java
// 置顶频道 1.置顶 0.取消置顶
WKIM.getInstance().getChannelManager().updateTop(String channelID, byte channelType, int isTop)
```

`Kotlin`

```kotlin
// 置顶频道
WKIM.getInstance().channelManager.setTopChannel(channelID, channelType, isTop)
```
#### 保存频道资料
`java`
```java
// 保存频道资料
WKIM.getInstance().getChannelManager().saveOrUpdateChannel(WKChannel channel)

// 批量保存频道资料
WKIM.getInstance().getChannelManager().saveOrUpdateChannels(List<WKChannel> list)
```
`kotlin`
```kotlin
// 保存频道资料
WKIM.getInstance().channelManager.saveOrUpdateChannel(channel)

// 批量保存频道资料
WKIM.getInstance().channelManager.saveOrUpdateChannels( list)
```

### 数据结构说明

#### 频道属性

```java
public class WKChannel {
    // 频道ID
    public String channelID;
    // 频道类型 1.为单聊 2.为群聊
    public byte channelType;
    // 频道名称
    public String channelName;
    // 频道备注(频道的备注名称，个人的话就是个人备注，群的话就是群别名)
    public String channelRemark;
    // 频道头像
    public String avatar;
    // 是否置顶
    public int top;
    // 免打扰
    public int mute;
    // 是否禁言
    public int forbidden;
    // 远程扩展
    public HashMap remoteExtraMap;
    // 本地扩展字段
    public HashMap extraMap;
}
```
