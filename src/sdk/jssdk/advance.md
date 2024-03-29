# 高级功能


## 自定义消息

### 自定义普通消息

我们以自定义一个 gif 消息为例。
#### 第一步继承 MessageContent 和定义 gif 消息的正文结构

```ts
class GifContent extends MessageContent {
  width!: number; // gif宽度
  height!: number; // gif高度
  url!: string; // gif远程下载地址
}
```

#### 第二步 编码解码

```ts

// 最终传递的消息内容为 {"type":101,"url":"xxxx","width":xxx,"height":xxx}

class GifContent extends MessageContent {
  width!: number // gif宽度
  height!: number // gif高度
  url!: string // gif远程下载地址

  // 解码
  decodeJSON(content: any) {
    this.width = content["width"] || 0
    this.height = content["height"] || 0
    this.url = content["url"]
  }
  // 编码
  encodeJSON() {
    return { "width": this.width, "height": this.height, "url": this.url }
  }

}

```
#### 第三步 注册

```ts

const contentTypeGif = 101 // 自定义消息类型
WKSDK.shared().register(contentTypeGif, () => new GifContent()); // gif动图
```

### 自定义附件消息

自定义附件消息的流程与普通消息差异不大，我们以图片消息为例

#### 第一步继承 MediaMessageContent

注意这里是继承 MediaMessageContent 不是 MessageContent，当发送附件消息的时候，sdk 会调用[上传任务](/sdk/jssdk/datasource.html#文件上传数据源),将本地的文件上传到服务器，然后再进行消息的编码和发送

最终传递的消息内容为 ```{"type":3,"url":"xxxx","width":xxx,"height":xxx}```

```ts

class ImageContent : MediaMessageContent {
  width!: number // 图片宽度
  height!: number // 图片高度
  url!: string // 图片远程下载地址
}
```
#### 第二步编码解码

```ts

class ImageContent : MediaMessageContent {
  width!: number // 图片宽度
  height!: number // 图片高度
  url!: string // 图片远程下载地址

  constructor(file?: File,width?:number,height?:number) {
      super()
      this.file = file // File为要上传的图片文件对象
      this.width = width || 0
      this.height = height || 0
  }
  // 附件file上传成功后会得到 this.remoteUrl这个远程下载地址，这时可以将此地址编码到消息内
   encodeJSON() {
      return { "width": this.width || 0, "height": this.height || 0, "url": this.remoteUrl || "" }
    }

    // 解码消息
    decodeJSON(content: any) {
        this.width = content["width"] || 0
        this.height = content["height"] || 0
        this.url = content["url"] || ''
    }
}

```

#### 第三步 注册

```ts
const contentTypeImage = 3 // 自定义消息类型
WKSDK.shared().register(contentTypeImage,() => new ImageContent());
```