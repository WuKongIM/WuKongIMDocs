# 提醒项管理

会话提醒目前只支持服务器下发指令。客户端只需监听同步会话提醒和监听刷新会话消息即可 
### 获取提醒项
`java`
```java 
// 获取指定会话的提醒项
List<WKReminder> allReminder = WKIM.getInstance().getReminderManager().getReminders(channelId, channelType);

// 获取指定类型的提醒项
WKIM.getInstance().getReminderManager().getRemindersWithType(String channelID, byte channelType, int type);
```
`kotlin`
```kotlin
// 获取指定会话的提醒项
val allReminder = WKIM.getInstance().reminderManager.s(channelId, channelType)

// 获取指定类型的提醒项
WKIM.getInstance().reminderManager.getRemindersWithType( channelID,  channelType, type);
```
### 保存提醒项
`java`
```java
// 保存提醒项
WKIM.getInstance().getReminderManager().saveOrUpdateReminders(List<WKReminder> reminderList);
```
`kotlin`
```kotlin
// 保存提醒项
WKIM.getInstance().reminderManager.saveOrUpdateReminders(list)
```

### 事件
#### 新增提醒项
`java`
```java
// 监听新增提醒项
WKIM.getInstance().getReminderManager().addOnNewReminderListener("key", new INewReminderListener() {
    @Override
    public void newReminder(List<WKReminder> list) {
        
    }
});
// 移出监听
WKIM.getInstance().getReminderManager().removeNewReminderListener("key");
```

`kotlin`
```kotlin
// 监听新增提醒项
WKIM.getInstance().reminderManager.addOnNewReminderListener("key", object : INewReminderListener {
    override fun newReminder(list: List<WKReminder>) {
        
    }
})

// 移出监听
WKIM.getInstance().reminderManager.removeNewReminderListener("key");
```

- <font color='#999' size=2>注：key为监听的唯一标识，可以为任意字符串，添加监听和移出监听时需要传入相同的key</font>
  
### 数据结构说明
```java

public class WKReminder {
    public long reminderID;     // 提醒项ID
    public String messageID;    // 消息ID
    public String channelID;    // 频道ID
    public byte channelType;    // 频道类型
    public long messageSeq;     // 消息序列号
    public int type;            // 提醒类型[1、有人@你][2、群内审核] 等
    public String uid;          
    public String text;         // 提醒内容
    public Map data;            //  提醒包含的自定义数据
    public long version;        // 版本号 增量同步需要用到
    public int done;            // 0.未完成 1.已完成
    public int needUpload;      // 0.不需要上传 1.需要上传
    public String publisher;    // 发布者
}
```

