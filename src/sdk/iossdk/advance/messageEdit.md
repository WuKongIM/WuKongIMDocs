
# 消息编辑

当我们发现发送的消息内容有误后，我们无需撤回后再编辑再发送，**WuKongIM**提供直接在发出去的消息上进行编辑的功能

<!-- <img src="./edit_before.png" width="250px">&nbsp;&nbsp; -->
<!-- <img src="./edit_after.png" width="250px"> -->


## 数据操作

```objc
// message 未原始消息对象
// newContent 为修改后的正文
// 返回编辑后的消息对象
WKMessage *messageEditAfter = [[WKSDK shared].chatManager editMessage:(WKMessage*)message newContent:(WKMessageContent*)newContent];

```


## 数据监听
如果别人编辑了消息或自己编辑了消息都会触发 WKChatManagerDelegate 的消息更新事件, 在此事件里我们通过 `message.remoteExtra.contentEdit` 对象可以获取到编辑后的正文

```objc
// ---------- WKChatManagerDelegate ----------
- (void) onMessageUpdate:(WKMessage*) message left:(NSInteger)left {
   WKMessageContent *orgContent =  message.content; // 原始正文
   WKMessageContent *editContent = message.remoteExtra.contentEdit; // 编辑后的正文
}

```

## 数据源

```objc
// 提交编辑内容。
[[[WKSDK shared] chatManager] setMessageEditProvider:^(WKMessageExtra * _Nonnull extra, WKMessageEditCallback  _Nonnull callback) {
	NSData  *editContentData =   extra.contentEditData; // 编辑后的正文数据
	// 请求自己的app服务端修改消息
	....
	// 修改结果回调
	callback(result);
}];

```

