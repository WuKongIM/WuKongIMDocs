# 最近会话管理


## 同步最近会话列表

`需要实现最近会话数据源` [最近会话数据源](/sdk/jssdk/datasource.html#最近会话数据源)

只有第一次打开应用时，需要同步最近会话列表， 后续最近会话列表的变化，通过监听来获取

```js

 const conversations = await WKSDK.shared().conversationManager.sync({})

```


## 监听最近会话列表


```js

const listen =  (conversation: Conversation, action: ConversationAction) => {

     if (action === ConversationAction.add) { // 新增最近会话

     } else if (action === ConversationAction.update) { // 更新最近会话

     } else if (action === ConversationAction.remove) { // 删除最近会话

     }
}

```

添加监听

```js

WKSDK.shared().conversationManager.addConversationListener(listen);

``` 

移出监听

```js

WKSDK.shared().conversationManager.removeConversationListener(listen)

```

## 其他常用方法

### 获取某个频道的最近会话

```js

const conversation = WKSDK.shared().conversationManager.findConversation(channel)

```

### 移出一个频道的最近会话

```js

WKSDK.shared().conversationManager.removeConversation(channel)

```

### 获取所红点数量


```js

const unreadCount = WKSDK.shared().conversationManager.getAllUnreadCount()

```

### 创建一个空会话

```js

WKSDK.shared().conversationManager.createEmptyConversation(channel)

```

