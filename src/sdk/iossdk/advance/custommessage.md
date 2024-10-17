# 自定义消息



### 自定义普通消息

我们以自定义一个 gif 消息为例。

#### 第一步 继承WKMessageContent 和定义 gif 消息的正文结构

```objc
@interface WKGIFContent : WKMessageContent

//GIF的地址
@property(nonatomic,copy) NSString *url;
// 宽度
@property(nonatomic,assign) NSInteger width;
// 高度
@property(nonatomic,assign) NSInteger height;

@end

```

#### 第二步 编码解码

```objc

// 最终传递的消息内容为 {"type":3,"url":"xxxx","width":xxx,"height":xxx}

@implementation WKGIFContent

// 定义消息正文类型
- (NSNumber*) contentType {
    return @(3);
}

// 发送消息时对消息内容编码
- (NSDictionary *)encodeWithJSON {
	NSMutableDictionary *dataDict = [NSMutableDictionary dictionary];
	[dataDict setObject:self.url?:@"" forKey:@"url"];
	[dataDict setObject:@(self.width) forKey:@"width"];
	[dataDict setObject:@(self.height) forKey:@"height"];
	return dataDict;
}

// 收到消息时对消息内容解码
- (void)decodeWithJSON:(NSDictionary *)contentDic {
	self.url = contentDic[@"url"];
	self.width = contentDic[@"width"]?[contentDic[@"width"] integerValue]:100;
	self.height = contentDic[@"height"]?[contentDic[@"height"] integerValue]:100;
}

// 最近会话显示的内容
- (NSString *)conversationDigest {
    return @"[gif表情]"
}

@end


```

#### 第三步 注册

```objc
[[WKSDK shared] registerMessageContent:WKGIFContent.class];
```

### 自定义附件消息

自定义附件消息的流程与普通消息差异不大，我们以图片消息为例

#### 第一步 继承WKMediaMessageContent

注意这里时继承 WKMediaMessageContent 不是 WKMessageContent

最终传递的消息内容为 ```{"type":4,"url":"xxxx","width":xxx,"height":xxx}```

```objc

@interface WKImageContent : WKMediaMessageContent


@property(nonatomic,assign) CGFloat width; // 图片宽度

@property(nonatomic,assign) CGFloat height; // 图片高度

@property(nonatomic,strong) NSData imageData; // 图片数据

@end
```
#### 第二步 编码解码和将需要上传的数据写入本地路径

```objc
@implementation WKImageContent

// 定义消息正文类型
 - (NSNumber*) contentType {
	return @(4);
}

// 将图片数据写入到本地路径，这样后面的上传任务会将此路径的附件上传到服务器
 - (void) writeDataToLocalPath {
	[super writeDataToLocalPath];
	[self.imageData writeToFile:self.localPath atomically:YES];
}

// 附件消息当附件上传成功后 会获取到上传后的self.remoteUrl下载地址，我们只需要将此下载地址编码到json里，附件的上传任务进度管理请查看 [WKSDK shared].mediaManager
- (NSDictionary *)encodeWithJSON {
	NSMutableDictionary *dataDict = [NSMutableDictionary dictionary];
	[dataDict setObject:self.remoteUrl?:@"" forKey:@"url"];
	[dataDict setObject:@(self.width) forKey:@"width"];
	[dataDict setObject:@(self.height) forKey:@"height"];
	return dataDict;
}
// 当收到消息需要解码，这时候我们只需要将下载地址url 赋值给self.remoteUrl后 下载任务会通过self.remoteUrl的下载地址进行下载附件 附件的下载任务进度管理请查看 [WKSDK shared].mediaManager
- (void)decodeWithJSON:(NSDictionary *)contentDic {
	self.remoteUrl = contentDic[@"url"];
	self.width = contentDic[@"width"]?[contentDic[@"width"] floatValue]:0;
	self.height = contentDic[@"height"]?[contentDic[@"height"] floatValue]:0;
}



@end

```

#### 第三步 注册

```objc
[[WKSDK shared] registerMessageContent:WKImageContent.class];
```
