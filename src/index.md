---
layout: home

title: 悟空IM
titleTemplate: 悟空IM

hero:
  name: 悟空IM
  text: 让信息传递更简单
  tagline: 悟空IM是高性能通用即时通讯服务，支持聊天应用，消息推送，物联网通讯，音视频信令，直播弹幕，客服系统，AI 通讯，即时社区等场景。
  image:
    src: /logo_white.png
    alt: logo
  actions:
   	- theme: brand
      text: 安装
      link: /install/
    - theme: alt
      text: 介绍
      link: /guide/

features:
  - icon: <span class="i-carbon:ibm-cloud-pak-integration"></span>
    title: 零依赖
    details: 没有依赖任何第三方组件，部署简单，一条命令即可启动
  - icon: <span class="i-carbon:plug"></span>
    title: 完全自研
    details: 自研消息数据库，消息分区永久存储，自研二进制协议，支持自定义协议
  - icon: <span class="i-carbon:ibm-cloud-hyper-protect-crypto-services"></span>
    title: 安全
    details: 消息通道和消息内容全程加密，防中间人攻击和串改消息内容
  - icon: <span class="i-carbon:ibm-cloud-pak-manta-automated-data-lineage"></span>
    title: 功能强劲
    details: MAC 笔记本单机测试 16w 多/秒的消息(包含存储)吞吐量，频道支持万人同时订阅
  - icon: <span class="i-carbon:deployment-pattern"></span>
    title: 扩展性强
    details: 采用频道设计理念，目前支持群组频道，点对点频道，后续可以根据自己业务自定义频道可实现机器人频道，客服频道等等
  - icon: <span class="i-carbon:api"></span>
    title: 兼容性强
    details: 同时无差别支持 tcp，websocket
---

<script setup>
import { onMounted } from 'vue'
import { fetchReleaseTag } from '../.vitepress/utils/fetchReleaseTag.js'

onMounted(() => {
  fetchReleaseTag()
})
</script>
