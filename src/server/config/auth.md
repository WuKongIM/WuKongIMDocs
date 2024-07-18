# 认证配置

```yaml
jwt:
    secret: "xxxx" # jwt密钥，这个配置比较重要，需要自己生成一个随机字符串（建议随机的32位字符串），用于jwt的加密
    expire: 30d # jwt过期时间 默认为30天 
auth:
   kind: 'jwt' # 认证方式 jwt: jwt认证  适用于后台管理授权登录
    # 用户配置
    #用户名:密码:资源:权限 *表示通配符   资源格式也可以是[资源ID:权限]  
    # 例如:  - "admin:pwd:[clusterchannel:rw]" 表示admin用户密码为pwd对clusterchannel资源有读写权限, 
    # - "admin:pwd:*" 表示admin用户密码为pwd对所有资源有读写权限  
    users:
        - "admin:pwd:*"       # 用户名为admin，密码为pwd，对所有资源有读写权限
        - "guest:guest:[*:r]" # guest用户密码为guest对所有资源只有读权限
    superToken: "" # 超级管理员token, 如果配置了超级管理员token, 携带超级管理员的token则可以跳过jwt认证（适合第三方业务服务端使用此方式）  （header里key为token）  
```