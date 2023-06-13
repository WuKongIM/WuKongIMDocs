import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    logo: '/logo.png',
    name: '悟空IM',
    hd: { rules: [] },
    socialLinks: {
      github: 'https://github.com/WuKongIM/WuKongIM',
    },
    footer: "Copyright © 2023 | Powered by 悟空IM | <a href='https://beian.miit.gov.cn/' style='color:gray'>ICP备案号：沪ICP备2021032718号-2</a>",
  },
  headScripts: ["https://hm.baidu.com/hm.js?219604efa41d5fcab346766087ead60a"] // 百度统计
});
