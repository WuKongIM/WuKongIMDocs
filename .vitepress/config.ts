import { defineConfig } from "vitepress";
import mdItCustomAttrs from "markdown-it-custom-attrs";

import UnoCSS from "unocss/vite";

import { navbar } from "./navbar";
import { sidebar } from "./sidebar";

export default defineConfig({
	title: "悟空IM",
	description: "IM",
	lang: "zh-CN",
	head: [
		["meta", { name: "keywords", content: "IM" }],
		["link", { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
		["link", { rel: "stylesheet", href: "/css/fancybox.css" }],
		["script", { src: "/js/fancybox.umd.js" }],
		["script", { src: "https://hm.baidu.com/hm.js?219604efa41d5fcab346766087ead60a" }], // 百度统计
	],
	markdown: {
		theme: {
			light: "vitesse-light",
			dark: "vitesse-dark",
		},
		config: (md) => md.use(mdItCustomAttrs, "image", { "data-fancybox": "gallery" }),
	},
	lastUpdated: true,
	srcDir: "./src",
	themeConfig: {
		logo: "/logo.png",
		siteTitle: "悟空IM",
		nav: navbar,
		sidebar: sidebar,
		lastUpdatedText: "上次更新",
		outlineTitle: "目录",
		outline: [2, 6],
		docFooter: {
			prev: "上一篇",
			next: "下一篇",
		},
		socialLinks: [
      { icon: 'github', link: 'https://github.com/WuKongIM/WuKongIM' }
    ],
		footer: {
			message: `本文档内容版权属于 悟空IM 作者，保留所有权利`,
			copyright: "Copyright © 2023 | Powered by 悟空IM | ICP备案号：沪ICP备2021032718号-2",
		},
		search: {
			provider: "local",
			options: {
				translations: {
					button: { buttonText: "搜索文档", buttonAriaLabel: "搜索文档" },
					modal: {
						noResultsText: "无法找到相关结果",
						resetButtonTitle: "清除查询条件",
						footer: { selectText: "选择", navigateText: "切换", closeText: "关闭" },
					},
				},
			},
		},
	},
	vite: {
		optimizeDeps: {
			exclude: ["vitepress"],
		},
		server: {
			host: "0.0.0.0",
		},
		plugins: [UnoCSS()],
	},
});
