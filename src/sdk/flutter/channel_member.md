# 频道成员管理
### 获取频道成员
#### 频道内所有成员
```dart
// 获取频道内所有成员
WKIM.shared.channelMemberManager.getMembers(channelId: channelId);
```
#### 频道内指定用户的成员信息
```dart
// 获取频道内指定用户的成员信息
WKIM.shared.channelMemberManager.getMember(channelId: channelId,uid;
```

### 事件
#### 刷新频道成员
```dart
// 刷新频道成员
WKIM.shared.channelMemberManager.addOnRefreshMemberListener('key', (WKChannelMember member,bool isEnd){
    // todo 刷新会话列表
});

// 移除刷新频道成员监听
WKIM.shared.channelMemberManager.removeRefreshMemberListener('key');
```

- <font color='#999' size=2>注：key为监听的唯一标识，可以为任意字符串，添加监听和移出监听时需要传入相同的key</font>

### 数据结构说明
```dart
class WKChannelMember {
  String channelID = "";
  //频道类型
  int channelType = 0;
  //成员id
  String memberUID = "";
  //成员名称
  String memberName = "";
  //成员备注
  String memberRemark = "";
  //成员头像
  String memberAvatar = "";
  //成员角色
  int role = 0;
  //成员状态黑名单等1：正常2：黑名单
  int status = 0;
  //是否删除
  int isDeleted = 0;
  //创建时间
  String createdAt = "";
  //修改时间
  String updatedAt = "";
  //版本
  int version = 0;
  // 机器人0否1是
  int robot = 0;
  //扩展字段
  dynamic extraMap;
  // 用户备注
  String remark = "";
  // 邀请者uid
  String memberInviteUID = "";
  // 被禁言到期时间
  int forbiddenExpirationTime = 0;
  String memberAvatarCacheKey = "";
}

```