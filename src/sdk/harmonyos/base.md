
# 基础


### 初始化
```typescript
// uid 登录用户ID（业务服务端在IM通讯端登记了的uid））
// token 登录用户token（业务服务端在IM通讯端登记了的token）
await WKIM.shared.init(uid, token)
```

### 连接地址
```typescript
WKIM.shared.config.provider.connectAddrCallback = (): Promise<string> => {
    // 通过网络获取连接地址后返回
    let add = HttpUtil.getIP()
    return add
}
```
- <font color="#999" font-size=2>返回 IM 通信端的 IP 和 IM 通信端的 TCP 端口。<font color="#FF0000">分布式可调用接口获取 IP 和 Port 后返回</font></font>

### 连接
```typescript
// 连接
WKIM.shared.connectionManager().connection()
```

### 断开
```typescript
// 断开 isLogout true：退出并清空用户信息 false：退出保持用户信息
WKIM.shared.connectionManager().disConnection(isLogout)
```

### 监听连接状态
```typescript
// 监听连接状态
WKIM.shared.connectionManager()
  .addConnectStatusListener((status: number, reasonCode?: number, connInfo?: ConnectionInfo) => {
    switch (status) {
      case WKConnectStatus.success: {
       // `悟空IM(连接成功-节点:${connInfo?.nodeId})`
        break
      }
      case WKConnectStatus.fail:
        // '连接失败'
        break
      case WKConnectStatus.connecting:
       // '连接中...'
        break
      case WKConnectStatus.syncing:
       // '同步中...'
        break
      case WKConnectStatus.syncCompleted:
       // `悟空IM(连接成功-节点:${this.nodeId})`
        break
      case WKConnectStatus.noNetwork:
       // '网络异常'
        break
      case WKConnectStatus.kicked:
       // '其他账号登录'
        break
    }
  })
```