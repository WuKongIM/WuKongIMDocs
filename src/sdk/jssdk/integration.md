
# 集成

## 安装

::: code-group

``` sh [npm]
npm i wukongimjssdk
```

``` sh [yarn]
yarn add wukongimjssdk
```

``` sh [pnpm]
pnpm add wukongimjssdk
```
:::


## 引入

::: code-group

``` js [ES6]
import WKSDK from "wukongimjssdk"
```


``` js [AMD]
const  WKSDK  = require("wukongimjssdk").default
```

``` js [浏览器]

<script src="https://cdn.jsdelivr.net/npm/wukongimjssdk@1.2.5/lib/wukongimjssdk.umd.js"></script>


```


:::

`通过<script>标签引入使用必须都加前缀 wk, 例如 wk.WKSDK.shared()`
