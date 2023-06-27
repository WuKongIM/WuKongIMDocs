import { DefaultTheme } from "vitepress/types/default-theme";

export const navbar: DefaultTheme.NavItem[] = [
	{
		text: " 指南",
		link: "/guide/guide",
		activeMatch: "^/guide",
	},
	{
		text: "API文档",
		link: "/api/",
		activeMatch: "^/api",
	},
	{
		text: "SDK文档",
		activeMatch: "^/sdk",
		items: [
			{ text: "IOS", link: "/sdk/ios" },
			{ text: "Android", link: "/sdk/android" },
			{ text: "Javascript", link: "/sdk/javascript" },
			{ text: "Uniapp", link: "/sdk/uniapp" },
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
	{
		text: "更新日志",
		link: "https://gitee.com/WuKongDev/WuKongIM/releases",
	},
	{
		text: "项目地址",
		activeMatch: "^/im",
		items: [
			{ text: "Github", link: "https://github.com/WuKongIM/WuKongIM" },
			{ text: "Gitee", link: "https://gitee.com/WuKongDev/WuKongIM" },
		],
	},
];
