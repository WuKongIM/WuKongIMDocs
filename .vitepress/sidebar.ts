import { DefaultTheme } from "vitepress";

export const sidebar: DefaultTheme.Sidebar = {
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
				{ text: "部署", link: "/guide/quickstart" },
				{ text: "集成到自己系统", link: "/guide/integration" },
			],
		},
		{
			text: "进阶",
			collapsed: false,
			items: [
				{ text: "最佳实践", link: "/guide/practice" },
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
	],
	"/sdk": [
		{ text: "概述", link: "/sdk/" },
		{ text: "IOS", link: "/sdk/ios" },
		{ text: "Android", link: "/sdk/android" },
		{ text: "Javascript", link: "/sdk/javascript" },
		{ text: "Uniapp", link: "/sdk/uniapp" },
		{ text: "Flutter", link: "/sdk/flutter" },
		{ text: "c", link: "/sdk/c" },
	]
};
