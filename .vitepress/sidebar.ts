import { DefaultTheme } from "vitepress";

export const sidebar: DefaultTheme.Sidebar = {
	"/guide": [
		{
			text: "介绍",
			collapsed: false,
			items: [
				{ text: "文档阅读引导", link: "/guide/guide" },
				{ text: "什么是WuKongIM", link: "/guide/" },
				{ text: "基础概念", link: "/guide/initialize" },
				{ text: "适用场景", link: "/guide/scene" },
			],
		},
	],
	"/install/": [
		{
			text: "Dokcer Compose（推荐）",
			collapsed: false,
			items: [
				{
					text: "部署",
					items: [
						{ text: "单节点模式", link: "/install/docker-compose/singlenode" },
						{ text: "多节点模式", link: "/install/docker-compose/multinode" },
					],

				},
				{
					text: "扩容",
					items: [
						{ text: "单节点模式扩容", link: "/install/docker-compose/singlenode-scale" },
						{ text: "多节点模式扩容", link: "/install/docker-compose/multinode-scale" },
					],
				},
				{
					text: "升级",
					link: "/install/docker-compose/upgrade",
				},
			],

		},
		{
			text: "Linux",
			collapsed: true,
			items: [
				{
					text: "部署",
					items: [
						{ text: "单节点模式", link: "/install/linux/singlenode" },
						{ text: "多节点模式", link: "/install/linux/multinode" },
					],

				},
				{
					text: "扩容",
					items: [
						{ text: "单节点模式扩容", link: "/install/linux/singlenode-scale" },
						{ text: "多节点模式扩容", link: "/install/linux/multinode-scale" },
					],
				},
				{
					text: "监控",
					link: "/install/linux/mointor",
				},
				{
					text: "升级",
					link: "/install/linux/upgrade",
				},
			],
		},
		{
			text: "Kubernetes",
			collapsed: true,
			items: [
				{
					text: "部署",
					items: [
						{ text: "单节点模式", link: "/install/k8s/singlenode" },
						{ text: "多节点模式", link: "/install/k8s/multinode" },
					],

				},
				{
					text: "扩容",
					items: [
						{ text: "单节点模式扩容", link: "/install/k8s/singlenode-scale" },
						{ text: "多节点模式扩容", link: "/install/k8s/multinode-scale" },
					],
				},
				// {
				// 	text: "升级",
				// 	link: "/install/k8s/upgrade",
				// },
			],

		},
	],
	"/server": [
		{
			text: "配置说明",
			link: "/server/config/config",
			items: [
				{ text: "WSS 配置", link: "/server/config/wss" },
				{ text: "认证配置", link: "/server/config/auth" },
			],
		},
		{
			text: "API文档",
			items: [
				{ text: "基础", link: "/server/api/" },
				{ text: "用户", link: "/server/api/user" },
				{ text: "频道", link: "/server/api/channel" },
				{ text: "消息", link: "/server/api/message" },
				{ text: "最近会话", link: "/server/api/conversation" },
				{ text: "Webhook", link: "/server/api/webhook" },
				{ text: "Datasource", link: "/server/api/datasource" },
				{ text: "API调用时机说明", link: "/server/api/instructions" },
			],
		},
		{
			text: "进阶",
			items: [
				{ text: "离线消息说明", link: "/server/advance/offlinemsg" },
				{ text: "集成到自己系统", link: "/server/advance/integration" },
				{ text: "WuKongIM 协议", link: "/server/advance/proto" },
			],
		},
	],
	"/sdk": [
		{ text: "概述", link: "/sdk/" },
		{
			text: "iOS",
			collapsed: true,
			items: [
				{ text: "说明", link: "/sdk/iossdk/intro" },
				{ text: "集成", link: "/sdk/iossdk/integration" },
				{ text: "连接管理", link: "/sdk/iossdk/connection" },
				{ text: "聊天管理", link: "/sdk/iossdk/chat" },
				{ text: "最近会话管理", link: "/sdk/iossdk/conversation" },
				{ text: "频道管理", link: "/sdk/iossdk/channel" },
				{ text: "多媒体管理", link: "/sdk/iossdk/media" },
				{ 
					text: "高级功能", 
					items: [
						{
							text: "自定义消息",
							link: "/sdk/iossdk/advance/custommessage"
						},
						{
							text: "消息编辑",
							link: "/sdk/iossdk/advance/messageEdit"
						},
						{
							text: "消息点赞",
							link: "/sdk/iossdk/advance/messageReaction"
						},
						{
							text: "消息已读",
							link: "/sdk/iossdk/advance/messageReaded"
						},
						{
							text: "会话提醒",
							link: "/sdk/iossdk/advance/reminder"
						},
					]

				 },
				{ text: "示例代码", link: "https://github.com/WuKongIM/WuKongIMiOSSDK/tree/main/Example" },
			]
		},
		{ text: "Android", link: "/sdk/android" },
		{ text: "Harmonyos", link: "/sdk/harmonyos" },
		{
			text: "Javascript",
			collapsed: true,
			items: [
				{ text: "说明", link: "/sdk/jssdk/intro" },
				{ text: "集成", link: "/sdk/jssdk/integration" },
				{ text: "基础", link: "/sdk/jssdk/base" },
				{ text: "聊天管理", link: "/sdk/jssdk/chat" },
				{ text: "最近会话管理", link: "/sdk/jssdk/conversation" },
				{ text: "频道管理", link: "/sdk/jssdk/channel" },
				{ text: "数据源管理", link: "/sdk/jssdk/datasource" },
				{ text: "高级功能", link: "/sdk/jssdk/advance" },
			]
		},
		{ text: "Uniapp", link: "/sdk/uniapp" },
		{ text: "Flutter", link: "/sdk/flutter" },
		{ text: "c", link: "/sdk/c" },
	]
};
