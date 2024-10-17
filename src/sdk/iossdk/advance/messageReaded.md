
# 消息已读

已读未读又称为回执，由`[WKSDK shared].receiptManager` 回执管理者管理


## 数据操作

发送消息的时候，在设置里开启消息回执`setting.receiptEnabled = true`

```objc
WKSetting *setting = [WKSetting new];
setting.receiptEnabled = true // 开启端消息回执
[[WKSDK shared].chatManager sendMessage:(WKMessageContent*)content channel:(WKChannel*)channel setting:setting]

```
当消息接受方UI展示消息的时候，执行以下代码，将消息标记为已读

```objc
[[WKSDK shared].receiptManager addReceiptMessages:(WKChannel*)channel messages:(NSArray<WKMessage*>*)messages];
```


## 数据监听

当消息已读的时候，会触发消息更新的方法

```objc
// ---------- WKChatManagerDelegate  ----------
/**
 消息更新
 @param message <#message description#>
 @param left 消息剩余数量 ，可当left为0时再刷新UI
 */
(void) onMessageUpdate:(WKMessage*) message left:(NSInteger)left {
	if(message.remoteExtra.readed) {
		NSLog(@"消息已读");
	}
}

```

## 数据源

```objc
 // 设置上传消息已读数据源。
 [[[WKSDK shared] receiptManager] setMessageReadedProvider:^(WKChannel *channel,NSArray<WKMessage *> * _Nonnull messages, WKMessageReadedCallback  _Nonnull callback) {

    // 请求自己的app服务端
     ....

    // 结果回调
    callback(result);

 }];

```
