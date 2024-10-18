# 提醒项管理
会话提醒目前只支持服务器下发指令。客户端只需监听同步会话提醒和监听刷新会话消息即可

### 获取提醒项

```dart
// 获取指定频道的提醒项列表 
WKIM.shared.reminderManager.getWithChannel(channelId,channelType)
```

### 保存提醒项

```dart
// 保存提醒项
WKIM.shared.reminderManager.saveOrUpdateReminders(list)
```
### 事件
#### 新增提醒项
```dart
// 监听新增提醒项
WKIM.shared.reminderManager.addOnNewReminderListener(key, (reminder) {
    // 处理新增提醒项
});

// 移除监听
WKIM.shared.reminderManager.removeOnNewReminderListener(key);
```
- <font color='#999' size=2>注：key为监听的唯一标识，可以为任意字符串，添加监听和移出监听时需要传入相同的key</font>
### 数据结构说明
```dart
class WKReminder {
  int reminderID = 0;               // 提醒项ID
  String messageID = '';            // 消息ID
  String channelID = '';            // 频道ID
  int channelType = 0;              // 频道类型
  int messageSeq = 0;               // 消息序列号
  int type = 0;                     // 提醒类型
  String text = '';                 // 提醒内容
  dynamic data;                     // 附加数据
  int version = 0;                  // 版本号
  int done = 0;                     // 完成状态
  int needUpload = 0;               // 是否需要上传（这里是指上传到业务服务器）
  String publisher = '';            // 发布者
}
```