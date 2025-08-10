#!/bin/bash

# WuKongIM 多架构镜像测试脚本
# 用于验证多架构镜像构建和推送是否正常工作

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置
PROJECT_NAME="wukongim-home"
REGISTRY="registry.cn-shanghai.aliyuncs.com"
NAMESPACE="wukongim"
IMAGE_NAME="$REGISTRY/$NAMESPACE/$PROJECT_NAME"

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker Buildx
check_buildx() {
    log_info "检查 Docker Buildx..."
    
    if ! docker buildx version &> /dev/null; then
        log_error "Docker Buildx 未安装或不可用"
        exit 1
    fi
    
    log_success "Docker Buildx 可用"
}

# 检查多架构构建器
check_builder() {
    log_info "检查多架构构建器..."
    
    if ! docker buildx inspect multiarch &> /dev/null; then
        log_warning "多架构构建器不存在，正在创建..."
        docker buildx create --name multiarch --use
        docker buildx inspect --bootstrap
    else
        log_info "使用现有的多架构构建器"
        docker buildx use multiarch
    fi
    
    log_success "多架构构建器就绪"
}

# 测试本地构建
test_local_build() {
    log_info "测试本地单架构构建..."
    
    make build-local
    
    # 检查镜像是否存在
    if docker images | grep -q "$PROJECT_NAME"; then
        log_success "本地镜像构建成功"
    else
        log_error "本地镜像构建失败"
        exit 1
    fi
}

# 测试多架构构建
test_multiarch_build() {
    log_info "测试多架构构建..."
    
    # 构建多架构镜像但不推送
    docker buildx build \
        --platform linux/amd64,linux/arm64 \
        -t "$IMAGE_NAME:test-multiarch" \
        -f Dockerfile . \
        --no-cache
    
    log_success "多架构构建测试成功"
}

# 测试镜像功能
test_image_functionality() {
    log_info "测试镜像功能..."
    
    # 启动容器
    docker run -d --name test-container -p 8080:80 "$PROJECT_NAME:latest"
    
    # 等待容器启动
    sleep 5
    
    # 健康检查
    if curl -f http://localhost:8080/health &> /dev/null; then
        log_success "健康检查通过"
    else
        log_error "健康检查失败"
        docker logs test-container
        docker rm -f test-container
        exit 1
    fi
    
    # 检查主页
    if curl -f http://localhost:8080/ &> /dev/null; then
        log_success "主页访问正常"
    else
        log_error "主页访问失败"
        docker logs test-container
        docker rm -f test-container
        exit 1
    fi
    
    # 清理测试容器
    docker rm -f test-container
    log_success "镜像功能测试通过"
}

# 检查远程镜像架构（如果已推送）
check_remote_architectures() {
    log_info "检查远程镜像架构..."
    
    if docker buildx imagetools inspect "$IMAGE_NAME:latest" &> /dev/null; then
        log_info "远程镜像架构信息："
        docker buildx imagetools inspect "$IMAGE_NAME:latest" | grep -E "(MediaType|Platform)"
        log_success "远程镜像检查完成"
    else
        log_warning "远程镜像不存在或无法访问"
    fi
}

# 清理测试资源
cleanup() {
    log_info "清理测试资源..."
    
    # 停止并删除测试容器
    docker rm -f test-container &> /dev/null || true
    
    # 删除测试镜像
    docker rmi "$IMAGE_NAME:test-multiarch" &> /dev/null || true
    
    log_success "清理完成"
}

# 主函数
main() {
    log_info "开始多架构镜像测试..."
    
    # 设置清理陷阱
    trap cleanup EXIT
    
    # 执行测试
    check_buildx
    check_builder
    test_local_build
    test_image_functionality
    test_multiarch_build
    check_remote_architectures
    
    log_success "🎉 所有测试通过！"
    echo ""
    echo "$(echo -e ${YELLOW})测试结果总结:$(echo -e ${NC})"
    echo "✓ Docker Buildx 可用"
    echo "✓ 多架构构建器就绪"
    echo "✓ 本地单架构构建成功"
    echo "✓ 镜像功能正常"
    echo "✓ 多架构构建成功"
    echo ""
    echo "$(echo -e ${YELLOW})下一步操作:$(echo -e ${NC})"
    echo "1. 运行 'make deploy' 进行完整部署"
    echo "2. 运行 'make inspect-remote' 检查远程镜像架构"
    echo "3. 运行 'make info' 查看详细信息"
}

# 显示帮助
show_help() {
    echo "WuKongIM 多架构镜像测试脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -c, --cleanup  仅执行清理操作"
    echo ""
    echo "此脚本将测试："
    echo "  - Docker Buildx 环境"
    echo "  - 多架构构建器设置"
    echo "  - 本地单架构构建"
    echo "  - 镜像功能测试"
    echo "  - 多架构构建测试"
}

# 解析参数
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -c|--cleanup)
        cleanup
        exit 0
        ;;
    "")
        main
        ;;
    *)
        log_error "未知参数: $1"
        show_help
        exit 1
        ;;
esac
