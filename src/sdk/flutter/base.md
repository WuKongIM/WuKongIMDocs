# 基础
### 初始化

#### 连接IP
```dart
WKIM.shared.options.getAddr = (Function(String address) complete) async {
      // 可通过接口获取后返回
      complete('xxxxx:5100');
    };
```
- <font color="#999" font-size=2>返回 IM 通信端的 IP 和 IM 通信端的 TCP 端口。<font color="#FF0000">分布式可调用接口获取 IP 和 Port 后返回</font></font>

#### 初始化sdk
```dart
// uid 登录用户ID（业务服务端在IM通讯端登记了的uid））
// token 登录用户token（业务服务端在IM通讯端登记了的token）
WKIM.shared.setup(Options.newDefault('uid', 'token'));
```

### 连接/断开
#### 连接   
```dart
WKIM.shared.connectionManager.connect();
```

#### 断开   
```dart
// isLogout true：退出并不再重连 false：退出保持重连
WKIM.shared.connectionManager.disconnect(isLogout)
```


### 连接状态监听
```dart
WKIM.shared.connectionManager.addOnConnectionStatus('home',
        (status, reason, connInfo) {
      if (status == WKConnectStatus.connecting) {
        // 连接中
      } else if (status == WKConnectStatus.success) {
        // 连接成功
        // connInfo.nodeId 节点ID
      } else if (status == WKConnectStatus.noNetwork) {
        // 没有网络连接
      } else if (status == WKConnectStatus.syncMsg) {
       // 同步消息
      } else if (status == WKConnectStatus.kicked) {
       // 被踢下线 需退出应用回到登录界面
      } else if (status == WKConnectStatus.fail) {
       // 连接失败
      } else if (status == WKConnectStatus.syncCompleted) {
        // 同步完成
      }
    });
```

