# 频道管理

频道(Channel)WuKongIM 中是一个比较抽象的概念。发送消息都是先发送给频道，频道根据自己的配置规则进行投递消息，频道分频道和频道详情。 更多介绍请移步[什么是频道](/guide/initialize#频道)

### 数据源

`需要实现获取频道资料的数据源` [获取频道资料数据源](/sdk/flutter/datasource.html#频道资料数据源)
### 频道资料
#### 获取频道资料
```dart
// 获取某个channel资料
WKIM.shared.channelManager.getChannel(String channelID,int channelType);
```

#### 强制刷新频道资料
```dart
// 强制刷新某个channel资料
WKIM.shared.channelManager.fetchChannelInfo(String channelID, int channelType)
```
### 事件
#### 监听频道更新事件
```dart
//  监听channel刷新事件
WKIM.shared.channelManager.addOnRefreshListener('key',(wkChannel){
    // 刷新对应channel 信息
});

// 移除监听
WKIM.shared.channelManager.removeOnRefreshListener('key');
```

- <font color='#999' size=2>注：key为监听的唯一标识，可以为任意字符串，添加监听和移出监听时需要传入相同的key</font>

### 常用方法
```dart
// 批量保存频道资料
WKIM.shared.channelManager.addOrUpdateChannels(List<WKChannel> channelList);

// 搜索
WKIM.shared.channelManager.search(String keyword);
```
### 数据结构说明
```dart

class WKChannel {
  String channelID = "";
  int channelType = WKChannelType.personal;
  String channelName = "";
  //频道备注(频道的备注名称，个人的话就是个人备注，群的话就是群别名)
  String channelRemark = "";
  int showNick = 0;
  //是否置顶
  int top = 0;
  //是否保存在通讯录
  int save = 0;
  //免打扰
  int mute = 0;
  //禁言
  int forbidden = 0;
  //邀请确认
  int invite = 0;
  //频道状态[1：正常2：黑名单]
  int status = 1;
  //是否已关注 0.未关注（陌生人） 1.已关注（好友）
  int follow = 0;
  //是否删除
  int isDeleted = 0;
  //创建时间
  String createdAt = "";
  //修改时间
  String updatedAt = "";
  //频道头像
  String avatar = "";
  //版本
  int version = 0;
  //扩展字段
  dynamic localExtra;
  //是否在线
  int online = 0;
  //最后一次离线时间
  int lastOffline = 0;
  // 最后一次离线设备标识
  int deviceFlag = 0;
  //是否回执消息
  int receipt = 0;
  // 机器人
  int robot = 0;
  //分类[service:客服]
  String category = "";
  String username = "";
  String avatarCacheKey = "";
  dynamic remoteExtraMap;
  String parentChannelID = "";
  int parentChannelType = 0;
}
```