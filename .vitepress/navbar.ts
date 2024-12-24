import { DefaultTheme } from "vitepress";

export const navbar: DefaultTheme.NavItem[] = [
	{
		text: " 介绍",
		link: "/guide/guide",
		activeMatch: "^/guide",
	},
	{
		text: " 安装",
		link: "/install/",
		activeMatch: "^/install",
	},
	{
		text: " 服务端",
		link: "/server/config/config",
		activeMatch: "^/server",
	},
	{
		text: "SDK文档",
		activeMatch: "^/sdk",
		items: [
			{ text: "iOS", link: "/sdk/iossdk/intro" },
			{ text: "Android", link: "/sdk/android/intro" },
			{ text: "Javascript", link: "/sdk/jssdk/intro" },
			{ text: "Flutter", link: "/sdk/flutter/intro" },
			{ text: "Uniapp", link: "/sdk/uniapp" },
			{ text: "微信小程序", link: "/sdk/smallprogram" },
			{ text: "HarmonyOS", link: "/sdk/harmonyos/intro" },
		],
	},
	{
		text: "Demo 演示",
		activeMatch: "^/demo",
		items: [
			{ text: "前端聊天", link: "http://imdemo.githubim.com/" },
			{ text: "后台监控", link: "http://monitor.githubim.com/web" }
		],
	},
	// {
	// 	text: "更新日志",
	// 	link: "https://gitee.com/WuKongDev/WuKongIM/releases",
	// },
	{
		"text": "v2",
		items: [
			{text: "v1", link: "https://v1.githubim.com/guide/guide.html"},
		],
	},
];
