# 频道管理

频道(Channel)WuKongIM 中是一个比较抽象的概念。发送消息都是先发送给频道，频道根据自己的配置规则进行投递消息，频道分频道和频道详情。 更多介绍请移步[什么是频道](/guide/initialize#频道)

### 数据源

`需要实现获取频道资料的数据源` [获取频道资料数据源](/sdk/harmonyos/datasource.html#频道资料数据源)
### 频道资料

#### 获取频道资料
```javascript
// 获取频道资料
let channel = WKIM.shared.channelManager().getChannel(channelId, channelType)
```
#### 强制刷新频道资料
```javascript
// 强制刷新频道资料
WKIM.shared.channelManager().fetchChannelInfo(channelId, channelType)
```

### 事件
#### 监听频道资料更新
```javascript
refreshChannelListener = (channel: WKChannel) => {
   // 刷新
  }
  // 添加刷新频道监听
WKIM.shared.channelManager().addRefreshListener(this.refreshChannelListener)

// 在退出页面时移除监听
WKIM.shared.channelManager().removeRefreshListener(this.refreshChannelListener)
```

### 常用方法
```typescript
// 保存频道资料
WKIM.shared.channelManager().addOrUpdate(channel: WKChannel)

// 批量保存
WKIM.shared.channelManager().addOrUpdates(list: WKChannel[])

// 修改频道头像缓存地址
WKIM.shared.channelManager().updateAvatarCacheKey(channelId: string, channelType: number, key: string)
```

### 数据结构说明
```typescript
export class WKChannel {
  channelId: string             // 频道ID  
  channelType: number           // 频道类型
  channelName: string = ""      // 频道名称
  channelRemark: string = ""    // 频道备注
  showNick: number = 0          // 显示昵称 0.不显示 1.显示
  top: number = 0               // 置顶 0.不置顶 1.置顶
  save: number = 0              // 是否保存到通讯录 0.不保存 1.保存
  mute: number = 0              // 是否免打扰 0.不免打扰 1.免打扰
  forbidden: number = 0         // 是否禁言 0.不禁言 1.禁言
  invite: number = 0            // 是否允许邀请 0.不允许 1.允许
  status: number = 0            // 频道状态 0.禁用 1.正常
  follow: number = 0            // 关注状态 0.未关注 1.已关注
  isDeleted: number = 0         // 是否删除 0.未删除 1.已删除
  createdAt: string = ''        // 创建时间
  updatedAt: string = ''        // 更新时间
  avatar: string = ''           // 头像
  version: number = 0           // 频道版本
  online: number = 0            // 在线状态 0.离线 1.在线
  lastOffline: number = 0       // 最后离线时间
  deviceFlag: number = 0        // 设备标识 0.APP 1.WEB 2.PC
  receipt: number = 0           // 是否开启回执 0.未开启 1.开启
  robot: number = 0             // 是否为机器人 0.不是 1.是
  category: string = ''         // 频道分类
  username: string = ''         // 用户名
  avatarCacheKey: string = ''   // 头像缓存key
  localExtra?: Record<string, Object>   // 本地扩展
  remoteExtra?: Record<string, Object>  // 远程扩展
  parentChannelId: string = ''          // 父频道ID
  parentChannelType: number = 0         // 父频道类型
}
```