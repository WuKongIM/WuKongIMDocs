import { DefaultTheme } from "vitepress";
import { Versioned } from "vitepress-versioning-plugin";

export const sidebar: Versioned.Sidebar = {
	"/guide": [
		{
			text: "介绍",
			collapsed: false,
			items: [
				{ text: "文档阅读引导", link: "/guide/guide" },
				{ text: "什么是悟空 IM", link: "/guide/" },
				{ text: "基础概念", link: "/guide/initialize" },
				{ text: "适用场景", link: "/guide/scene" },
				{ text: "Demo 演示", link: "/guide/demo" },
			],
		},
		{
			text: "快速开始",
			collapsed: false,
			items: [
				{ text: "执行文件部署（推荐）", link: "/guide/deploy-binary" },
				{ text: "Docker方式部署", link: "/guide/deploy-docker" },
				{ text: "Docker Compose方式部署", link: "/guide/deploy-dockercompose" },
				{ text: "部署配置", link: "/guide/deploy-config" },
			],
		},
		{
			text: "进阶",
			collapsed: false,
			items: [
				{ text: "离线消息说明", link: "/guide/offlinemsg" },
				{ text: "集成到自己系统", link: "/guide/integration" },
				// { text: "最佳实践", link: "/guide/practice" },
				{ text: "配置说明", link: "/guide/fullconfig" },
				{ text: "WSS 配置", link: "/guide/wss" },
				{ text: "命令行工具", link: "/guide/cli" },
				{ text: "测试", link: "/guide/stress" },
				{ text: "悟空 IM 协议", link: "/guide/proto" },
			],
		},
		{
			text: "其他",
			collapsed: false,
			items: [
				{ text: "常见问题", link: "/guide/others" },
			],
		}
	],
	"/api": [
		{ text: "基础", link: "/api/" },
		{ text: "用户", link: "/api/user" },
		{ text: "频道", link: "/api/channel" },
		{ text: "消息", link: "/api/message" },
		{ text: "最近会话", link: "/api/conversation" },
		{ text: "Webhook", link: "/api/webhook" },
		{ text: "Datasource", link: "/api/datasource" },
		{ text: "API调用时机说明", link: "/api/instructions" },
	],
	"/sdk": [
		{ text: "概述", link: "/sdk/" },
		{ text: "iOS", link: "/sdk/ios" },
		{ text: "Android", link: "/sdk/android" },
		{
			text: "Javascript",
			collapsed: true,
			items: [
				{text:"说明",link:"/sdk/jssdk/intro"},
				{text:"集成",link:"/sdk/jssdk/integration"},
				{text:"基础",link:"/sdk/jssdk/base"},
				{text:"聊天管理",link:"/sdk/jssdk/chat"},
				{text:"最近会话管理",link:"/sdk/jssdk/conversation"},
				{text:"频道管理",link:"/sdk/jssdk/channel"},
				{text:"数据源管理",link:"/sdk/jssdk/datasource"},
				{text:"高级功能",link:"/sdk/jssdk/advance"},
			]
		},
		{ text: "Uniapp", link: "/sdk/uniapp" },
		{ text: "Flutter", link: "/sdk/flutter" },
		{ text: "c", link: "/sdk/c" },
	]
};
