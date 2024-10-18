# 集成

## 快速入门

**Gradle**

[![](https://jitpack.io/v/WuKongIM/WuKongIMAndroidSDK.svg)](https://jitpack.io/#WuKongIM/WuKongIMAndroidSDK)

```
implementation implementation 'com.github.WuKongIM:WuKongIMAndroidSDK:version' // 版本号请看上面
```

jitpack 还需在主程序的`build.gradle`文件中添加：

```
allprojects {
    repositories {
        ...
        maven { url 'https://jitpack.io' }
    }
}
```

由于 sdk 内使用了 sqlcipher 加密数据库和 curve25519 加密算法，需将库添加到项目中

```
implementation "net.zetetic:android-database-sqlcipher:4.5.3"
implementation "androidx.sqlite:sqlite-ktx:2.3.1"
implementation 'org.whispersystems:curve25519-android:0.5.0'
implementation 'org.whispersystems:signal-protocol-android:2.8.1'
```

**混淆**

```
-dontwarn com.xinbida.wukongim.**
-keep class com.xinbida.wukongim.**{*;}

#数据库加密
-keep,includedescriptorclasses class net.sqlcipher.** { *; }
-keep,includedescriptorclasses interface net.sqlcipher.** { *; }

#--------- 混淆dh curve25519-------
-keep class org.whispersystems.curve25519.**{*;}
-keep class org.whispersystems.** { *; }
-keep class org.thoughtcrime.securesms.** { *; }
```
