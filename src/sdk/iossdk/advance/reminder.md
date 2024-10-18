# 会话提醒管理

会话提醒目前只支持服务端下发指令，客户端同步提醒然后显示提醒，会话提醒由 `[WKSDK shared].reminderManager` 管理

可以实现类似 @我，入群申请等等会话提醒

## 数据操作


```objc
// 同步提醒，离线后上线首次调用，或服务器主动下发指令去同步
[[WKSDK shared].reminderManager sync];

// 提醒项已处理完成，ids为提醒项的唯一ID集合
[[WKSDK shared].reminderManager done:(NSArray<NSNumber*>*)ids];
```

## 数据监听

```objc
// ---------- WKReminderManagerDelegate ----------

// 某个频道的reminders发生变化
(void) reminderManager:(WKReminderManager*)manager didChange:(WKChannel*)channel reminders:(NSArray<WKReminder*>*) reminders {

}

```

## 数据源

同步提醒数据源，需要实现请求服务器获取提醒的逻辑

`触发时机：调用[[WKSDK shared].reminderManager sync]时`

```objc

[[WKSDK shared].reminderManager setReminderProvider:^(WKReminderCallback  _Nonnull callback) {
       
}];

```

完成提醒数据源，需要实现请求服务器完成提醒的逻辑

`触发时机：调用[[WKSDK shared].reminderManager done:(NSArray<NSNumber*>*)ids]时`

```objc

[[WKSDK shared].reminderManager setReminderDoneProvider:^(NSArray<NSNumber *> * _Nonnull ids, WKReminderDoneCallback  _Nonnull callback) {
       
}];

```