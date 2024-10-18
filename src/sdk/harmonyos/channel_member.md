# 频道成员管理
### 获取频道成员
#### 获取某个频道下的所有成员
```typescript
// 获取某个channel下的所有成员
let members = WKIM.shared.channelMemberManager().getMembers(channelId, channelType)
```
#### 分页查询频道成员
`需要实现分页获取频道成员资料的数据源` [获取分页频道成员资料数据源](/sdk/harmonyos/datasource.html#频道成员分页数据源)
```typescript
// 分页获取频道成员
WKIM.shared.channelMemberManager().getWithPageOrSearch(channelId, channelType,option)
```
`option`说明
```typescript
export class SyncChannelMemberOptions {
  searchKey: string = ''  // 搜索关键字
  page: number = 0       // 页码
  limit: number = 20    // 每页数量
}
```
### 事件
#### 监听刷新频道成员
```typescript
refreshChannelMemberListener = (members: WKChannelMember[]) => {
  // 刷新
}
// 添加刷新频道成员监听
WKIM.shared.channelMemberManager().addRefreshListener(this.refreshChannelMemberListener)

// 在退出页面时移除监听
WKIM.shared.channelMemberManager().removeRefreshListener(this.refreshChannelMemberListener)
```

### 数据结构说明
```typescript

export class WKChannelMember {
  channelId: string = ''                            // 频道ID
  channelType: number = WKChannelType.personal       // 频道类型
  memberUID: string = ''                            // 成员UID  
  memberName: string = ''                            // 成员名称
  memberRemark: string = ''                          // 成员备注
  memberAvatar: string = ''                          // 成员头像
  role = 0                                           // 成员角色
  status = 0                                          // 成员状态
  isDeleted = 0                                       // 是否被删除
  createdAt: string = ''                             // 创建时间
  updatedAt: string = ''                             // 更新时间
  version = 0                                        // 版本号
  robot = 0                                          // 是否为机器人
  extra?: Record<string, object>                     // 扩展字段
  memberInviteUID: string = ''                       // 邀请人UID
  forbiddenExpirationTime = 0                       // 禁言截止时间
  memberAvatarCacheKey: string = ''                  // 头像缓存key
}

```