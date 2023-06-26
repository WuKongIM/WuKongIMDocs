# WSS 配置

```yaml
wssAddr: 'wss://0.0.0.0:5210'
wssConfig:
  certFile: '' # 必填 wss公钥证书文件路径， 完整路径，不要使用相对路径
  keyFile: '' # 必填 wss证书私钥key文件路径，完整路径，不要使用相对路径
external:
  wssAddr: 'wss://xxx:5210' # 对外暴露的wss地址, 如果为空则默认为 wss://外网IP:5210
```

如果使用的 docker 部署，参考 yaml 配置怎么转环境变量的配置 [链接](/guide/fullconfig#环境变量)
