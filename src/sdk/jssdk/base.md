
# 基础



## 配置


``` js
// 集群模式通过此方法获取连接地址
// WKSDK.shared().config.provider.connectAddrCallback = async (callback: ConnectAddrCallback) => {
//     const addr = await xxxx // addr 格式为 ip:port
//     callback(addr)
// }

// 单机模式可以直接设置地址
WKSDK.shared().config.addr = 'ws://IP:PORT'; // 默认端口为5200
// 认证信息
WKSDK.shared().config.uid = 'xxxx'; // 用户uid（需要在悟空通讯端注册过）
WKSDK.shared().config.token = 'xxxx'; // 用户token （需要在悟空通讯端注册过）


```

更多配置,查看：

`WKSDK.shared().config`;

## 连接


``` js
// 连接
WKSDK.shared().connectManager.connect();

```

## 断开

``` js

// 断开
WKSDK.shared().connectManager.disconnect();

```

## 监听连接状态

``` js

// 连接状态监听
WKSDK.shared().connectManager.addConnectStatusListener(
  (status: ConnectStatus, reasonCode?: number) => {
    if (status === ConnectStatus.Connected) {
      console.log('连接成功');
    } else {
      console.log('连接失败', reasonCode); //  reasonCode: 2表示认证失败（uid或token错误）
    }
  },
);

```