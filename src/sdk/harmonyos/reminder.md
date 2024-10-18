# 提醒项管理
会话提醒目前只支持服务器下发指令。客户端只需监听同步会话提醒和监听刷新会话消息即可

### 获取提醒项
```typescript   
// 获取指定频道的提醒项
// channelId: 频道ID
// channelType: 频道类型
// done: 1.已经完成的提醒项 0.未完成的提醒项
WKIM.shared.reminderManager().get(channelId,channelType,done)
```
### 保存提醒项
```typescript   
// 保存提醒项
WKIM.shared.reminderManager().save(list: WKReminder[])
```

### 事件
#### 新增/更新事件
```typescript   
refreshReminders = (reminders: WKReminder[]): void => {
    // 新增提醒项 或 更新提醒项
}

// 监听提醒项
WKIM.shared.reminderManager().addRefreshListener(this.refreshReminders)

// 移除监听
WKIM.shared.reminderManager().removeRefreshListener(this.refreshReminders)

```

### 数据结构说明
```typescript   

export class WKReminder {
  // 提醒项ID
  reminderId = 0
  // 消息ID
  messageId = ''
  // 所属频道ID
  channelId: string = ''
  // 所属频道类型
  channelType: number = WKChannelType.personal
  // 消息序号
  messageSeq = 0
  // 提醒项类型 1.[@某人] 2.[入群申请] ...
  type = 0
  // 显示内容
  text = ''
  // 提醒项内容
  data?: Record<string, Object>
  // 版本号 增量同步需要
  version = 0
  // 是否完成 1.是
  done = 0
  // 是否需要上传到服务器
  needUpload = 0
  // 发布者
  publisher = ''
}
```