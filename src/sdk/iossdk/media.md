# 多媒体管理

`消息里的文件，图片，视频，语音等多媒体资源都是通过多媒体管理器来管理的。`

负责消息的多媒体资源的管理，包括上传，下载等操作。

文档只介绍核心方法，更多内容查看代码的`[WKSDK shared].mediaManager`接口

## 自定义上传


### 创建任务

伪代码如下：

```objc

// 继承WKMessageFileDownloadTask
@interface WKFileUploadTask : WKMessageFileUploadTask

@end

```

```objc

// 实现四个方法  initWithMessage  resume cancel suspend
@implementation WKFileUploadTask

(instancetype)initWithMessage:(WKMessage *)message {
	self = [super initWithMessage:message];
	if(self) {
			[self initTask];
	}
	return self;
}

(void) initTask {
  WKMediaContent *mediaContent = (WKMediaContent*)self.message.content;

  NSString *fileLocalPath =  mediaContent.localPath;  // 附件本地路径

  // 以下为上传伪代码
  NSURLSessionDataTask *task = [serverAPI upload:fileLocalPath].progress(^(progress){
        self.progress = progress; // 内部方法 更新任务进度
        self.status = WKTaskStatusProgressing; // 内部方法  更新任务状态
        [self update]; // 内部方法 通知更新
  }).success(^{
      self.status = WKTaskStatusSuccess; // 内部方法  更新任务状态
      [self update]; // 内部方法 通知更新
  }).catch(^(NSError *error){
       self.status = WKTaskStatusError;  // 内部方法  更新任务状态
       self.error = error;  // 内部方法  更新错误信息
        [self update]; // 内部方法 通知更新
  });
  self.task = task;
}

// 任务恢复
(void) resume {
  [self.task resume];
}

// 任务取消
(void) cancel {
  [self.task cancel];
}

// 任务挂起
(void)suspend {
  [self.task suspend];
}

@end

```

### 注册任务

注册上传任务

```objc
  [[WKSDK shared].mediaManager setUploadTaskProvider:^id<WKTaskProto> _Nonnull(WKMessage * _Nonnull message) {
        return [[WKFileUploadTask alloc] initWithMessage:message];
  }];
```


## 自定义下载


所有带附件消息的下载都会通过此下载任务进行下载

### 创建任务

伪代码如下：

```objc

// 继承WKMessageFileDownloadTask
@interface WKFileDownloadTask : WKMessageFileDownloadTask

@end

```

```objc

// 实现四个方法  initWithMessage  resume cancel suspend
@implementation WKFileDownloadTask

(instancetype)initWithMessage:(WKMessage *)message {
	self = [super initWithMessage:message];
	if(self) {
			[self initTask];
	}
	return self;
}

(void) initTask {
  WKMediaContent *mediaContent = (WKMediaContent*)self.message.content;

  NSString *downloadURL =  mediaContent.remoteUrl;  // 附件下载地址

  // 以下为下载伪代码
  NSURLSessionDownloadTask *task = [serverAPI download:downloadURL].progress(^(progress){
        self.progress = progress; // 内部方法 更新任务进度
        self.status = WKTaskStatusProgressing; // 内部方法  更新任务状态
        [self update]; // 内部方法 通知更新
  }).success(^{
      self.status = WKTaskStatusSuccess; // 内部方法  更新任务状态
      [self update]; // 内部方法 通知更新
  }).catch(^(NSError *error){
       self.status = WKTaskStatusError;  // 内部方法  更新任务状态
       self.error = error;  // 内部方法  更新错误信息
        [self update]; // 内部方法 通知更新
  });
  self.task = task;
}

// 任务恢复
(void) resume {
  [self.task resume];
}

// 任务取消
(void) cancel {
  [self.task cancel];
}

// 任务挂起
(void)suspend {
   [self.task suspend];
}

@end

```

### 注册任务

注册下载任务

```objc
  [[WKSDK shared].mediaManager setDownloadTaskProvider:^id<WKTaskProto> _Nonnull(WKMessage * _Nonnull message) {
        return [[WKFileDownloadTask alloc] initWithMessage:message];
  }];

```

## 进度管理

### 上传

获取指定消息的上传任务，然后获取进度

```objc
WKMessageFileUploadTask *uploadTask = [[WKSDK shared] getMessageFileUploadTask:message];
if(uploadTask) {
  float progress = uploadTask.progress;
}       

```

监听上传任务进度

```objc
WKMessageFileUploadTask *uploadTask = [[WKSDK shared] getMessageFileUploadTask:message];
if(uploadTask) {
  [uploadTask addListener:^{
    float progress = uploadTask.progress;
  }];
}  
```

### 下载

下载消息里的附件

```objc
WKMessageFileDownloadTask *downloadTask = [[WKSDK shared].mediaManager download:message];
```

获取指定消息的下载任务，然后获取进度

```objc

WKMessageFileDownloadTask *downloadTask = [[WKSDK shared] getMessageFileDownloadTask:message];
if(downloadTask) {
  float progress = downloadTask.progress;
}       

```

监听下载任务进度

```objc
WKMessageFileDownloadTask *downloadTask = [[WKSDK shared] getMessageFileDownloadTask:message];
if(downloadTask) {
  [downloadTask addListener:^{
    float progress = downloadTask.progress;
  }];
}  
```
