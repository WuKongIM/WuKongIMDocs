# 命令管理
CMD(命令)消息只能是服务器下发客户端进行解析 cmd消息格式
### 监听命令消息

```dart
// 监听命令消息
WKIM.shared.cmdManager.addOnCmdListener('chat', (cmdMsg) {
    // todo 按需处理cmd消息
});

// 移除监听
WKIM.shared.cmdManager.removeCmdListener('chat');
```

### 数据结构说明
```dart
class WKCMD {
  String cmd = ''; // 命令ID
  dynamic param; // 对应命令参数
}
```