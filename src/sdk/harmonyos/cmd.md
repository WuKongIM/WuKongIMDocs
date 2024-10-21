# 命令管理
CMD(命令)消息只能是服务器下发客户端进行解析 cmd消息格式
### 监听命令消息

```typescript
cmdListener = (cmd: WKCMD) => {
  // 处理CMD消息
}
// 添加CMD消息监听
WKIM.shared.cmdManager().addCmdListener(this.cmdListener)


// 在退出页面时移除监听
WKIM.shared.cmdManager().removeCmdListener(this.cmdListener)
```

### 数据结构说明
```typescript   
export class WKCMD {
  cmd: string = '' // 命令Id
  paramJsonObject?: Record<string, Object> // 命令参数
}
```