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
		text: "项目地址",
		activeMatch: "^/im",
		items: [
			{ text: "Github", link: "https://github.com/WuKongIM/WuKongIM" },
			{ text: "Gitee", link: "https://gitee.com/WuKongDev/WuKongIM" },
		],
	},
];
