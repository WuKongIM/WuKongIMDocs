
# 连接管理

负责IM连接的建立，维护，断开等等

文档只介绍核心方法，更多内容查看代码的`[WKSDK shared].connectionManager`接口

## 配置

```objc
[WKSDK shared].options.host = @"xxx.xxx.xxx.xxx"; // IM通信端的IP
[WKSDK shared].options.port = 5100; // IM通信端的TCP端口

 // 设置IM连接认证信息
[WKSDK shared].options.connectInfoCallback = ^WKConnectInfo * _Nonnull{
    WKConnectInfo *connectInfo = [WKConnectInfo new];
    connectInfo.uid = "xxxx"; // 用户uid （业务服务端在IM通讯端登记了的uid）
    connectInfo.token = "xxxx"; // 用户的token （业务服务端在IM通讯端登记了的token）
    return  connectInfo;
};

```
更多配置请查看 `[WKSDK shared].options`

## 连接


``` objc
// 连接
 [[WKSDK shared].connectionManager connect];

```

## 断开

``` objc

 // 断开连接 NO: SDK保持重连机制  YES: SDK将不再进行重连
 [[WKSDK shared].connectionManager disconnect:NO];

```

## 监听连接状态


```objc
[WKSDK.shared.connectManager addDelegate:self]; // WKConnectionManagerDelegate
```

```objc

// ---------- WKConnectionManagerDelegate ----------

/**
 连接状态监听
 */
-(void) onConnectStatus:(WKConnectStatus)status reasonCode:(WKReason)reasonCode {
  if(status == WKConnetced) {
    NSLog(@"连接成功！");
  }
}

```