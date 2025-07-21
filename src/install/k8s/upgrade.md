#### 1. 更新Helm仓库
```bash
helm repo update
```

### 2. 搜索新的版本 Chart
```bash
helm search repo wukongim
```

### 3. 更新
```bash
helm upgrade wkim wukongim/wukongim -n wukongim --create-namespace --version 版本号
```