# WuKongIM 文档项目容器化部署指南

本文档提供了 WuKongIM 文档项目的完整容器化部署方案，包括 Docker、Kubernetes 等多种部署方式。

## 📋 目录

- [前置条件](#前置条件)
- [快速开始](#快速开始)
- [部署方式](#部署方式)
- [配置说明](#配置说明)
- [常见问题](#常见问题)
- [监控和维护](#监控和维护)

## 🔧 前置条件

### 必需软件

- **Docker**: 版本 20.10+ (支持 Buildx)
- **Docker Compose**: 版本 2.0+
- **Make**: 用于执行 Makefile 命令
- **Git**: 用于代码管理
- **curl**: 用于健康检查

### 多架构支持

本项目支持构建多架构镜像：
- **linux/amd64**: Intel/AMD 64位处理器
- **linux/arm64**: ARM 64位处理器 (Apple Silicon, ARM服务器等)

### 可选软件

- **Kubernetes**: 版本 1.20+ (用于 K8s 部署)
- **kubectl**: Kubernetes 命令行工具
- **Helm**: Kubernetes 包管理器

### 系统要求

- **操作系统**: Linux, macOS, Windows (with WSL2)
- **内存**: 最少 512MB，推荐 1GB+
- **磁盘**: 最少 1GB 可用空间
- **网络**: 能够访问容器镜像仓库

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd WuKongIMDocs/home
```

### 2. 配置环境

```bash
# 复制环境配置文件
cp .env.example .env

# 根据需要修改配置
vim .env
```

### 3. 一键部署

```bash
# 使用 Makefile (推荐)
make deploy

# 或使用部署脚本
./deploy.sh prod --push
```

### 4. 验证部署

```bash
# 检查容器状态
docker ps

# 访问应用
curl http://localhost/health
```

## 🐳 部署方式

### 方式一: Makefile 部署 (推荐)

```bash
# 查看所有可用命令
make help

# 设置多架构构建环境
make setup-buildx

# 构建本地单架构镜像（用于测试）
make build-local

# 构建多架构镜像（amd64 + arm64）
make build

# 测试镜像
make test

# 推送多架构镜像到仓库
make push

# 完整部署流程（构建 -> 测试 -> 推送）
make deploy

# 本地运行
make run

# 查看日志
make logs

# 停止容器
make stop

# 检查远程镜像架构
make inspect-remote

# 清理镜像
make clean

# 清理 Buildx 构建器
make clean-buildx
```

### 多架构构建说明

```bash
# 测试多架构构建环境
./test-multiarch.sh

# 仅构建本地镜像（单架构，用于快速测试）
make build-local

# 构建并推送多架构镜像
make build  # 构建多架构镜像
make push   # 推送到仓库

# 检查远程镜像支持的架构
make inspect-remote
```

### 方式二: 部署脚本

```bash
# 查看帮助
./deploy.sh --help

# 部署到开发环境
./deploy.sh dev

# 部署到生产环境并推送镜像
./deploy.sh prod --push

# 强制重新构建
./deploy.sh prod --force --clean
```

### 方式三: Docker Compose

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

### 方式四: 手动 Docker 命令

```bash
# 构建镜像
docker build -t wukongim-docs:latest .

# 运行容器
docker run -d \
  --name wukongim-docs \
  -p 80:80 \
  --restart unless-stopped \
  wukongim-docs:latest

# 查看日志
docker logs -f wukongim-docs
```

### 方式五: Kubernetes 部署

```bash
# 应用配置
kubectl apply -f k8s-deployment.yaml

# 查看部署状态
kubectl get pods -n wukongim

# 查看服务
kubectl get svc -n wukongim

# 查看 Ingress
kubectl get ingress -n wukongim
```

## ⚙️ 配置说明

### 环境变量配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `PROJECT_NAME` | `wukongim-docs` | 项目名称 |
| `REGISTRY` | `registry.cn-hangzhou.aliyuncs.com` | 镜像仓库地址 |
| `NAMESPACE` | `wukongim` | 镜像命名空间 |
| `ENVIRONMENT` | `production` | 部署环境 |
| `HTTP_PORT` | `80` | HTTP 端口 |
| `TZ` | `Asia/Shanghai` | 时区设置 |

### 镜像仓库配置

支持多种镜像仓库:

```bash
# Docker Hub
REGISTRY=docker.io
NAMESPACE=your-username

# 阿里云容器镜像服务
REGISTRY=registry.cn-hangzhou.aliyuncs.com
NAMESPACE=your-namespace

# 腾讯云容器镜像服务
REGISTRY=ccr.ccs.tencentyun.com
NAMESPACE=your-namespace

# 私有仓库
REGISTRY=your-private-registry.com
NAMESPACE=your-namespace
```

### Nginx 配置优化

项目包含了优化的 Nginx 配置:

- **Gzip 压缩**: 减少传输大小
- **静态资源缓存**: 提高加载速度
- **安全头**: 增强安全性
- **健康检查**: 支持容器健康检查

## 🔍 监控和维护

### 健康检查

```bash
# 容器健康检查
curl http://localhost/health

# Docker 健康状态
docker inspect --format='{{.State.Health.Status}}' wukongim-docs
```

### 日志管理

```bash
# 查看容器日志
docker logs wukongim-docs

# 实时查看日志
docker logs -f wukongim-docs

# 查看 nginx 访问日志
docker exec wukongim-docs tail -f /var/log/nginx/access.log
```

### 性能监控

```bash
# 查看容器资源使用
docker stats wukongim-docs

# 查看镜像大小
docker images | grep wukongim-docs
```

## 🛠️ 常见问题

### Q1: 构建失败，提示权限错误

**解决方案:**
```bash
# 确保 Docker 守护进程运行
sudo systemctl start docker

# 将用户添加到 docker 组
sudo usermod -aG docker $USER
newgrp docker
```

### Q2: 容器启动失败

**解决方案:**
```bash
# 查看详细错误信息
docker logs wukongim-docs

# 检查端口是否被占用
netstat -tlnp | grep :80

# 使用不同端口启动
docker run -d -p 8080:80 wukongim-docs:latest
```

### Q3: 镜像推送失败

**解决方案:**
```bash
# 登录镜像仓库
docker login registry.cn-hangzhou.aliyuncs.com

# 检查镜像标签
docker images | grep wukongim-docs

# 重新标记镜像
docker tag wukongim-docs:latest registry.cn-hangzhou.aliyuncs.com/wukongim/wukongim-docs:latest
```

### Q4: Kubernetes 部署失败

**解决方案:**
```bash
# 检查集群状态
kubectl cluster-info

# 查看 Pod 状态
kubectl describe pod -n wukongim

# 查看事件
kubectl get events -n wukongim --sort-by='.lastTimestamp'
```

### Q5: 访问速度慢

**解决方案:**
```bash
# 启用 Gzip 压缩 (已默认启用)
# 配置 CDN 加速
# 优化静态资源缓存策略
# 使用多副本部署
```

## 📚 更多资源

- [Docker 官方文档](https://docs.docker.com/)
- [Kubernetes 官方文档](https://kubernetes.io/docs/)
- [Nginx 配置指南](https://nginx.org/en/docs/)
- [WuKongIM 项目主页](https://github.com/WuKongIM/WuKongIM)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进部署方案。

## 📄 许可证

本项目采用 MIT 许可证，详见 LICENSE 文件。
