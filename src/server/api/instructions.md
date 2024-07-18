
# API调用时机说明

所有悟空IM的API应该都由业务后端调用，业务后端再将结果返回给app，不要将悟空IM的API暴露给app。

## app用户注册/登录时

业务后端需要调用悟空IM的接口，将用户注册到悟空IM。


[注册或登录](/server/api/user.html#注册或登录)

## app启动时

1. [获取长连接地址](/server/api/user.html)

2. [同步离线的最近会话](/server/api/conversation.html#同步最近会话)

3. [同步离线的命令消息](/server/api/message.html#同步离线命令消息)

4. [回执离线命令消息](/server/api/message.html#回执离线命令消息) （表示命令app已经成功收到，服务端可以移除了）

## app使用时

1. [查看某个群/个人的历史消息](/server/api/message.html#获取某频道消息)

2. [清空某个群/个人的红点数量](/server/api/conversation.html#设置最近会话红点数量)

3. [创建群或更新群](/server/api/channel.html#创建或更新频道)

4. [添加群成员](/server/api/channel.html#添加订阅者)

5. [禁止某个群成员发消息/拉黑好友](/server/api/channel.html#添加黑名单)

6. [全员禁言管理员除外](/server/api/channel.html#设置白名单)（将管理员拉入白名单，未在白名单的都不能发言）

7. [删除群/个人的最近会话](/server/api/conversation.html#删除最近会话)

8. [删除群](/server/api/channel.html#删除频道)（删除群后，消息并不会删除，只是群内不能发消息了，客户端可以将此群的最近会话删除了，本地数据也清空了，理论上此群就被删除了）

9. 等等

`（以上是以IM的场景为例并只列举了主要的一些API）`