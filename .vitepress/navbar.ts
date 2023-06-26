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
		link: "/sdk/",
		activeMatch: "^/sdk",
	},
	{
		text: "相关链接",
		activeMatch: "^/im",
		items: [
			{ text: "Go", link: "https://pkg.go.dev/" },
			{ text: "Node", link: "https://nodejs.org/" },
		],
	},
];
