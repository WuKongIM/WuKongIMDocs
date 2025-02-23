# 基础

### 初始化

在 Application 的 onCreate 方法中初始化 SDK

`Java`

```java
/**
*  初始化IM
* @param context Application Context
* @param uid 登录用户ID（业务服务端在IM通讯端登记了的uid））
* @param token 登录用户token（业务服务端在IM通讯端登记了的token）
*/
WKIM.getInstance().init(context, uid, token);
```

`Kotlin`

```kotlin
WKIM.getInstance().init(context,uid,token)
```

监听获取连接服务器 IP 和 Port 的事件

`Java`

```java
WKIM.getInstance().getConnectionManager().addOnGetIpAndPortListener(new IGetIpAndPort() {
            @Override
            public void getIP(IGetSocketIpAndPortListener iGetSocketIpAndPortListener) {
                // 返回连接IP和端口
                iGetSocketIpAndPortListener.onGetSocketIpAndPort("xxx",xxx);
            }
        });
```

`Kotlin`

```kotlin
WKIM.getInstance().connectionManager.addOnGetIpAndPortListener { p0 ->
    p0!!.onGetSocketIpAndPort(
        "172.0.0.0",
        6666
    )
}
```

- <font color="#999" font-size=2>返回 IM 通信端的 IP 和 IM 通信端的 TCP 端口。<font color="#FF0000">分布式可调用接口获取 IP 和 Port 后返回</font></font>

### 连接与断开

#### 连接与断开 IM

`Java`

```java
// 连接IM
WKIM.getInstance().getConnectionManager().connection();

// 断开IM
WKIM.getInstance().getConnectionManager().disconnect(isLogout);
```

`Kotlin`

```kotlin
// 连接IM
WKIM.getInstance().connectionManager.connection()

// 断开IM
WKIM.getInstance().connectionManager.disconnect(isLogout)
```

- <font color='#999'>isLogout: true：SDK 将不再进行重连 false：SDK 保持重连机制</font>

#### 连接状态监听

`Java`

```java
 WKIM.getInstance().getConnectionManager().addOnConnectionStatusListener("key", new IConnectionStatus() {
            @Override
            public void onStatus(int status, String reason) {
                if(status == WKConnectStatus.success){
                    // 连接成功
                }else if(status == WKConnectStatus.failed){
                    // 连接失败
                }else if(status == WKConnectStatus.connecting){
                    // 连接中
                } else if(status == WKConnectStatus.syncMsg){
                    // 同步消息中
                }else if(status == WKConnectStatus.noNetwork){
                    // 无网络
                }else if(status == WKConnectStatus.kicked){
                    // 被踢下线 需退出应用回到登录页面
                }
            }
        });
```

`Kotlin`

```kotlin
 WKIM.getInstance().connectionManager.addOnConnectionStatusListener(
            "key"
        ) { code, reason ->
           if (code == WKConnectStatus.success){
               // 连接成功
           }
        }
```