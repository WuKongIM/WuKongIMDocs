# 数据源管理

## 文件

### 文件上传数据源

代码如下：

``` ts
参考代码如下
export class MediaMessageUploadTask extends MessageTask {
    private _progress?:number
    private canceler: Canceler | undefined
    getUUID(){
        var len=32;//32长度
        var radix=16;//16进制
        var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');var uuid=[],i;radix=radix||chars.length;if(len){for(i=0;i<len;i++)uuid[i]=chars[0|Math.random()*radix];}else{var r;uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';uuid[14]='4';for(i=0;i<36;i++){if(!uuid[i]){r=0|Math.random()*16;uuid[i]=chars[(i===19)?(r&0x3)|0x8:r];}}}
        return uuid.join('');
      }

    async start(): Promise<void> {
        const mediaContent = this.message.content as MediaMessageContent
        if(mediaContent.file) {
            const param = new FormData();
            param.append("file", mediaContent.file);
            const fileName = this.getUUID();
            const path = `/${this.message.channel.channelType}/${this.message.channel.channelID}/${fileName}${mediaContent.extension??""}`
            const uploadURL =  this.getUploadURL(path)
            this.uploadFile(mediaContent.file,uploadURL)
        }else {
            console.log('多媒体消息不存在附件！');
            if (mediaContent.remoteUrl && mediaContent.remoteUrl !== "") {
                this.status = TaskStatus.success
                this.update()
            } else {
                this.status = TaskStatus.fail
                this.update()
            }
        }
    }

   async uploadFile(file:File,uploadURL:string) {
        const param = new FormData();
        param.append("file", file);
        const resp = await axios.post(uploadURL,param,{
            headers: { "Content-Type": "multipart/form-data" },
            cancelToken: new axios.CancelToken((c: Canceler) => {
                this.canceler = c
            }),
            onUploadProgress: e => {
                var completeProgress = ((e.loaded / e.total) | 0);
                this._progress = completeProgress
                this.update()
            }
        }).catch(error => {
            console.log('文件上传失败！->', error);
            this.status = TaskStatus.fail
            this.update()
        })
        if(resp) {
            if(resp.data.path) {
                const mediaContent = this.message.content as MediaMessageContent
                mediaContent.remoteUrl = resp.data.path
                this.status = TaskStatus.success
                this.update()
            }
        }
    }

    // 获取上传路径
     getUploadURL(path:string) :string {
       return 'http://xxxx'
    }

    // 请求暂停
    suspend(): void {
    }
    // 请求恢复
    resume(): void {
    }
    // 请求取消
    cancel(): void {
        this.status = TaskStatus.cancel
        if(this.canceler) {
            this.canceler()
        }
        this.update()
    }
    progress(): number {
        return this._progress??0
    }

}

```

注册上传任务

```ts
WKSDK.shared().config.provider.messageUploadTaskCallback = (message: Message): MessageTask => {
    return new MediaMessageUploadTask(message)
}
```

完整代码参考：[TangSengDaoDaoWeb](https://github.com/TangSengDaoDao/TangSengDaoDaoWeb/blob/main/packages/tsdaodaodatasource/src/task.ts)


## 最近会话

### 最近会话数据源

```ts
// 提供最近会话同步的数据源
WKSDK.shared().config.provider.syncConversationsCallback = async (): Promise<Array<Conversation>> => {
  // 后端提供的获取最近会话列表的接口数据 然后构建成 Conversation对象数组返回
  let conversations = new Array<Conversation>();
  conversations = await request(...)
  return conversations
})
```

## 频道

### 获取频道资料数据源

```ts
WKSDK.shared().config.provider.channelInfoCallback = async function (channel: Channel): Promise<ChannelInfo> {
    // 后端提供的获取频道资料的接口数据 然后构建成 ChannelInfo对象返回
    let channelInfo = new ChannelInfo();
    channelInfo = await request(...)
   //  channelInfo.orgData = ...  //一些第三方数据可以放在channelInfo.orgData中
    return channelInfo
}
```


### 同步频道订阅者数据源

```js

WKSDK.shared().config.provider.syncSubscribersCallback = async function (channel: Channel, version: number): Promise<Array<Subscriber>> {
    // 后端提供的获取频道订阅者列表的接口数据 然后构建成 Subscriber对象数组返回
    let subscribers = new Array<Subscriber>();
    subscribers = await request(...)
    // subscriber.orgData = ...  //一些第三方数据可以放在subscriber.orgData中
    return subscribers
}

```

## 消息

### 同步频道消息数据源

```js

WKSDK.shared().config.provider.syncMessagesCallback = async function(channel:Channel,opts:SyncOptions): Promise<Message[]> {
    // 后端提供的获取频道消息列表的接口数据 然后构建成 Message对象数组返回
    let messages = new Array<Message>();
    messages = await request(...)
    // message.remoteExtra.extra = ...  //一些第三方数据可以放在这里
    return messages
}

```

<!-- ## 同步离线cmd数据源 -->

