# WuKongIM 文档项目 Makefile
# 用于自动化构建和部署容器镜像

# 配置变量
PROJECT_NAME := wukongim-home
VERSION := $(shell date +%Y%m%d-%H%M%S)
LATEST_TAG := latest

# 容器仓库配置 (可根据需要修改)
REGISTRY := registry.cn-shanghai.aliyuncs.com
NAMESPACE := wukongim
IMAGE_NAME := $(PROJECT_NAME)
FULL_IMAGE_NAME := $(REGISTRY)/$(NAMESPACE)/$(IMAGE_NAME)

# Docker 配置
DOCKER_BUILD_ARGS := --no-cache --pull
DOCKERFILE := Dockerfile
CONTEXT := .
PLATFORMS := linux/amd64,linux/arm64

# 颜色输出配置
RED := \033[31m
GREEN := \033[32m
YELLOW := \033[33m
BLUE := \033[34m
RESET := \033[0m

# 默认目标
.DEFAULT_GOAL := help

# 帮助信息
.PHONY: help
help: ## 显示帮助信息
	@echo "$(BLUE)WuKongIM 文档项目部署工具$(RESET)"
	@echo ""
	@echo "$(YELLOW)可用命令:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)配置信息:$(RESET)"
	@echo "  项目名称: $(PROJECT_NAME)"
	@echo "  镜像仓库: $(FULL_IMAGE_NAME)"
	@echo "  当前版本: $(VERSION)"
	@echo "  支持架构: $(PLATFORMS)"
	@echo ""
	@echo "$(YELLOW)多架构说明:$(RESET)"
	@echo "  build-local: 构建本地单架构镜像（用于测试）"
	@echo "  build:       构建多架构镜像（amd64 + arm64）"
	@echo "  push:        推送多架构镜像到仓库"

# 检查 Docker 环境
.PHONY: check-docker
check-docker: ## 检查 Docker 环境
	@echo "$(BLUE)检查 Docker 环境...$(RESET)"
	@docker --version || (echo "$(RED)错误: Docker 未安装或未启动$(RESET)" && exit 1)
	@docker info > /dev/null 2>&1 || (echo "$(RED)错误: Docker 守护进程未运行$(RESET)" && exit 1)
	@echo "$(GREEN)✓ Docker 环境正常$(RESET)"

# 设置 Docker Buildx
.PHONY: setup-buildx
setup-buildx: ## 设置 Docker Buildx 多平台构建
	@echo "$(BLUE)设置 Docker Buildx...$(RESET)"
	@docker buildx version > /dev/null 2>&1 || (echo "$(RED)错误: Docker Buildx 未安装$(RESET)" && exit 1)
	@docker buildx inspect multiarch > /dev/null 2>&1 || docker buildx create --name multiarch --use
	@docker buildx use multiarch
	@docker buildx inspect --bootstrap
	@echo "$(GREEN)✓ Docker Buildx 设置完成$(RESET)"

# 检查必要文件
.PHONY: check-files
check-files: ## 检查必要文件
	@echo "$(BLUE)检查必要文件...$(RESET)"
	@test -f $(DOCKERFILE) || (echo "$(RED)错误: $(DOCKERFILE) 文件不存在$(RESET)" && exit 1)
	@test -f index.html || (echo "$(RED)错误: index.html 文件不存在$(RESET)" && exit 1)
	@test -f nginx.conf || (echo "$(RED)错误: nginx.conf 文件不存在$(RESET)" && exit 1)
	@test -f default.conf || (echo "$(RED)错误: default.conf 文件不存在$(RESET)" && exit 1)
	@echo "$(GREEN)✓ 所有必要文件存在$(RESET)"

# 构建单架构镜像（本地测试用）
.PHONY: build-local
build-local: check-docker check-files ## 构建本地单架构 Docker 镜像
	@echo "$(BLUE)构建本地 Docker 镜像...$(RESET)"
	@echo "镜像名称: $(FULL_IMAGE_NAME):$(VERSION)"
	@docker build $(DOCKER_BUILD_ARGS) \
		-t $(FULL_IMAGE_NAME):$(VERSION) \
		-t $(FULL_IMAGE_NAME):$(LATEST_TAG) \
		-f $(DOCKERFILE) $(CONTEXT)
	@echo "$(GREEN)✓ 本地镜像构建完成$(RESET)"

# 构建多架构镜像
.PHONY: build
build: check-docker check-files setup-buildx ## 构建多架构 Docker 镜像 (amd64, arm64)
	@echo "$(BLUE)构建多架构 Docker 镜像...$(RESET)"
	@echo "镜像名称: $(FULL_IMAGE_NAME):$(VERSION)"
	@echo "支持平台: $(PLATFORMS)"
	@docker buildx build $(DOCKER_BUILD_ARGS) \
		--platform $(PLATFORMS) \
		-t $(FULL_IMAGE_NAME):$(VERSION) \
		-t $(FULL_IMAGE_NAME):$(LATEST_TAG) \
		-f $(DOCKERFILE) $(CONTEXT) \
		--load
	@echo "$(GREEN)✓ 多架构镜像构建完成$(RESET)"

# 测试镜像
.PHONY: test
test: ## 测试构建的镜像
	@echo "$(BLUE)测试 Docker 镜像...$(RESET)"
	@docker run --rm -d --name $(PROJECT_NAME)-test -p 8080:80 $(FULL_IMAGE_NAME):$(LATEST_TAG)
	@sleep 5
	@curl -f http://localhost:8080/health > /dev/null 2>&1 || (echo "$(RED)错误: 健康检查失败$(RESET)" && docker stop $(PROJECT_NAME)-test && exit 1)
	@docker stop $(PROJECT_NAME)-test
	@echo "$(GREEN)✓ 镜像测试通过$(RESET)"

# 登录容器仓库
.PHONY: login
login: ## 登录容器仓库
	@echo "$(BLUE)登录容器仓库...$(RESET)"
	@docker login $(REGISTRY)
	@echo "$(GREEN)✓ 登录成功$(RESET)"

# 推送多架构镜像
.PHONY: push
push: check-docker setup-buildx ## 推送多架构镜像到仓库
	@echo "$(BLUE)推送多架构镜像到仓库...$(RESET)"
	@echo "支持平台: $(PLATFORMS)"
	@docker buildx build $(DOCKER_BUILD_ARGS) \
		--platform $(PLATFORMS) \
		-t $(FULL_IMAGE_NAME):$(VERSION) \
		-t $(FULL_IMAGE_NAME):$(LATEST_TAG) \
		-f $(DOCKERFILE) $(CONTEXT) \
		--push
	@echo "$(GREEN)✓ 多架构镜像推送完成$(RESET)"
	@echo "镜像地址:"
	@echo "  $(FULL_IMAGE_NAME):$(VERSION) ($(PLATFORMS))"
	@echo "  $(FULL_IMAGE_NAME):$(LATEST_TAG) ($(PLATFORMS))"

# 完整部署流程（多架构）
.PHONY: deploy
deploy: build-local test push ## 执行完整的部署流程 (构建 -> 测试 -> 推送多架构)
	@echo "$(GREEN)🎉 多架构部署完成!$(RESET)"
	@echo ""
	@echo "$(YELLOW)部署信息:$(RESET)"
	@echo "  项目: $(PROJECT_NAME)"
	@echo "  版本: $(VERSION)"
	@echo "  镜像: $(FULL_IMAGE_NAME):$(VERSION)"
	@echo "  架构: $(PLATFORMS)"
	@echo ""
	@echo "$(YELLOW)使用方法:$(RESET)"
	@echo "  docker run -d -p 80:80 $(FULL_IMAGE_NAME):$(LATEST_TAG)"

# 本地运行
.PHONY: run
run: ## 本地运行容器
	@echo "$(BLUE)启动本地容器...$(RESET)"
	@docker run --rm -d --name $(PROJECT_NAME)-local -p 3000:80 $(FULL_IMAGE_NAME):$(LATEST_TAG)
	@echo "$(GREEN)✓ 容器已启动$(RESET)"
	@echo "访问地址: http://localhost:3000"
	@echo "停止容器: make stop"

# 停止本地容器
.PHONY: stop
stop: ## 停止本地容器
	@echo "$(BLUE)停止本地容器...$(RESET)"
	@docker stop $(PROJECT_NAME)-local || true
	@echo "$(GREEN)✓ 容器已停止$(RESET)"

# 查看日志
.PHONY: logs
logs: ## 查看容器日志
	@docker logs -f $(PROJECT_NAME)-local

# 清理镜像
.PHONY: clean
clean: ## 清理本地镜像
	@echo "$(BLUE)清理本地镜像...$(RESET)"
	@docker rmi $(FULL_IMAGE_NAME):$(VERSION) || true
	@docker rmi $(FULL_IMAGE_NAME):$(LATEST_TAG) || true
	@docker system prune -f
	@echo "$(GREEN)✓ 清理完成$(RESET)"

# 显示镜像信息
.PHONY: info
info: ## 显示镜像信息
	@echo "$(BLUE)镜像信息:$(RESET)"
	@docker images | grep $(IMAGE_NAME) || echo "暂无本地镜像"
	@echo ""
	@echo "$(BLUE)多架构构建器信息:$(RESET)"
	@docker buildx ls || echo "Buildx 未设置"

# 检查远程镜像架构
.PHONY: inspect-remote
inspect-remote: ## 检查远程镜像支持的架构
	@echo "$(BLUE)检查远程镜像架构...$(RESET)"
	@docker buildx imagetools inspect $(FULL_IMAGE_NAME):$(LATEST_TAG) || echo "镜像不存在或无法访问"

# 清理 Buildx 构建器
.PHONY: clean-buildx
clean-buildx: ## 清理 Buildx 构建器
	@echo "$(BLUE)清理 Buildx 构建器...$(RESET)"
	@docker buildx rm multiarch || true
	@echo "$(GREEN)✓ Buildx 构建器清理完成$(RESET)"
