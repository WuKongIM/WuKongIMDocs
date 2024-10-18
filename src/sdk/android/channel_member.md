# 频道成员管理

### 获取频道成员列表
#### 获取成员
`java`
```java
// 获取频道内所有成员
WKIM.getInstance().getChannelMembersManager().getMembers(channelId,channelType);

// 单个频道成员
WKIM.getInstance().getChannelMembersManager().getMembers(channelId,channelType,uid);
```
`kotlin`
```kotlin
// 获取频道内所有成员
WKIM.getInstance().channelMembersManager().getMembers(channelId,channelType);

// 单个频道成员
WKIM.getInstance().channelMembersManager().getMembers(channelId,channelType,uid);

```
#### 搜索成员

`需要实现频道成员数据源` [频道成员数据源](/sdk/android/datasource.html#频道成员数据源)

`java`
```java
// 搜索频道成员列表
WKIM.getInstance().getChannelMembersManager().getWithPageOrSearch(channelId, channelType, "keyword", 1, 20, (list, isRemote) -> {
            // list 成员列表    
            // isRemote 是否为远端数据
        });
```
`kotlin`

```kotlin
// 搜索频道成员列表
WKIM.getInstance().channelMembersManager().getWithPageOrSearch(channelId, channelType, "keyword", 1, 20, (list, isRemote) -> {
            // list 成员列表    
            // isRemote 是否为远端数据
        });
```
### 常用方法
#### 保存频道成员
`java`
```java
// 批量保存成员
WKIM.getInstance().getChannelMembersManager().save(List<WKChannelMember> list);
```
`kotlin`
```kotlin
// 批量保存成员
WKIM.getInstance().channelMembersManager().save(list)
```
#### 修改备注
`java`
```java
// 修改备注
WKIM.getInstance().getChannelMembersManager().updateRemarkName(channelId, channelType, uid, remark);
```
`kotlin`
```kotlin
// 修改备注
WKIM.getInstance().channelMembersManager().updateRemarkName(channelId, channelType, uid, remark)
```

### 数据结构说明
```java
public class WKChannelMember{
    //自增ID
    public long id;
    //频道id
    public String channelID;
    //频道类型
    public byte channelType;
    //成员id
    public String memberUID;
    //成员名称
    public String memberName;
    //成员备注
    public String memberRemark;
    //成员头像
    public String memberAvatar;
    //成员角色
    public int role;
    //成员状态黑名单等1：正常2：黑名单
    public int status;
    //是否删除
    public int isDeleted;
    //创建时间
    public String createdAt;
    //修改时间
    public String updatedAt;
    //版本
    public long version;
    // 机器人0否1是
    public int robot;
    //扩展字段
    public HashMap extraMap;
    // 用户备注
    public String remark;
    // 邀请者uid
    public String memberInviteUID;
    // 被禁言到期时间
    public long forbiddenExpirationTime;
    public String memberAvatarCacheKey;
}
```