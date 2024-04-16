import Theme from "vitepress/theme";
import type { EnhanceAppContext } from "vitepress";
import Layout from "./Layout.vue";

import "./styles/var.css";
import "./styles/custom.css";
import "uno.css";

import HomePreview from "./components/HomePreview.vue";

export default {
	...Theme,
	Layout,
	enhanceApp({ app }: EnhanceAppContext) {},
};
