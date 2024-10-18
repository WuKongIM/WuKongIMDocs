# 命令管理

CMD(命令)消息只能是服务器下发客户端进行解析 cmd消息格式

### 监听cmd消息

```java
 WKIM.getInstance().getCMDManager().addCmdListener("key", cmd -> {
            //处理cmd消息
        });
// 移出监听
WKIM.getInstance().getCMDManager().removeCmdListener("key");
```
```kotlin
 WKIM.getInstance().cmdManager.addCmdListener("key", { cmd ->
            //处理cmd消息
        })
// 移出监听
WKIM.getInstance().cmdManager.removeCmdListener("key")
```

### 数据结构说明

```java

public class WKCMD {
    // 命令ID
    public String cmdKey;
    // 命令参数
    public JSONObject paramJsonObject;
}

```



