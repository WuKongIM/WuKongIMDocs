
# 消息点赞


## 数据操作

```objc

/**
 添加或取消回应,如果同一个用户存在reactionName的回应则取消回应
 @param reactionName 回应的名称，一般是emoji或本地emoji图片的名称
 @param messageID 回应消息的ID
 @param complete 结果回调
 */
[[WKSDK shared].reactionManager addOrCancelReaction:(NSString*)reactionName messageID:(uint64_t)messageID complete:(void(^_Nullable)(NSError  * _Nullable error))complete];

```

当点击某个会话的时候需要增量同步一下当前会话的回应

```objc

[[WKSDK shared].reactionManager sync:channel];

```

## 数据监听

如果有别人回应(点赞)，我们可以通过 WKReactionManagerDelegate 监听到

```objc

// ---------- WKReactionManagerDelegate  ----------

(void) reactionManagerChange:(WKReactionManager*)reactionManager reactions:(NSArray<WKReaction*>*)reactions channel:(WKChannel*)channel {

}

```

## 数据源

```objc
// channel 频道
// messageID 点赞的消息对应的消息id
// reactionName 点赞的符号名称
// callback 请求服务器后将结果回调给sdk
[[WKSDK shared].reactionManager setAddOrCancelReactionProvider:^(WKChannel * _Nonnull channel, uint64_t messageID,  NSString *reactionName,WKAddOrCancelReactionsCallback  _Nonnull callback) {
         
}];
```