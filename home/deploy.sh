#!/bin/bash

# WuKongIM 文档项目自动化部署脚本
# 用于快速部署到不同环境

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# 显示帮助信息
show_help() {
    echo "WuKongIM 文档项目部署脚本"
    echo ""
    echo "用法: $0 [选项] [环境]"
    echo ""
    echo "环境:"
    echo "  dev         开发环境"
    echo "  test        测试环境"
    echo "  prod        生产环境"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -v, --version  显示版本信息"
    echo "  -f, --force    强制重新构建"
    echo "  -c, --clean    清理旧镜像"
    echo "  --no-cache     不使用缓存构建"
    echo "  --push         构建后推送到仓库"
    echo ""
    echo "示例:"
    echo "  $0 dev                    # 部署到开发环境"
    echo "  $0 prod --push           # 部署到生产环境并推送镜像"
    echo "  $0 test --force --clean  # 强制重新构建并清理旧镜像"
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."
    
    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    # 检查 Docker 是否运行
    if ! docker info &> /dev/null; then
        log_error "Docker 守护进程未运行，请启动 Docker"
        exit 1
    fi
    
    # 检查 make
    if ! command -v make &> /dev/null; then
        log_warning "Make 未安装，将使用 Docker 命令"
    fi
    
    log_success "依赖检查完成"
}

# 加载环境配置
load_env() {
    local env=$1
    local env_file=".env.${env}"
    
    if [[ -f "$env_file" ]]; then
        log_info "加载环境配置: $env_file"
        source "$env_file"
    elif [[ -f ".env" ]]; then
        log_info "加载默认环境配置: .env"
        source ".env"
    else
        log_warning "未找到环境配置文件，使用默认配置"
    fi
}

# 构建镜像
build_image() {
    local env=$1
    local force=$2
    local no_cache=$3
    
    log_info "开始构建镜像..."
    
    local build_args=""
    if [[ "$no_cache" == "true" ]]; then
        build_args="--no-cache"
    fi
    
    if [[ "$force" == "true" ]]; then
        build_args="$build_args --pull"
    fi
    
    # 设置镜像标签
    local version=$(date +%Y%m%d-%H%M%S)
    local image_tag="${PROJECT_NAME:-wukongim-docs}:${version}"
    local latest_tag="${PROJECT_NAME:-wukongim-docs}:latest"
    
    # 构建镜像
    docker build $build_args \
        -t "$image_tag" \
        -t "$latest_tag" \
        -f Dockerfile .
    
    log_success "镜像构建完成: $image_tag"
    
    # 导出镜像信息
    export BUILT_IMAGE="$image_tag"
    export LATEST_IMAGE="$latest_tag"
}

# 测试镜像
test_image() {
    log_info "测试镜像..."
    
    local test_container="wukongim-docs-test"
    local test_port="8080"
    
    # 清理可能存在的测试容器
    docker rm -f "$test_container" &> /dev/null || true
    
    # 启动测试容器
    docker run -d --name "$test_container" -p "$test_port:80" "$LATEST_IMAGE"
    
    # 等待容器启动
    sleep 5
    
    # 健康检查
    if curl -f "http://localhost:$test_port/health" &> /dev/null; then
        log_success "镜像测试通过"
    else
        log_error "镜像测试失败"
        docker logs "$test_container"
        docker rm -f "$test_container"
        exit 1
    fi
    
    # 清理测试容器
    docker rm -f "$test_container"
}

# 推送镜像
push_image() {
    log_info "推送镜像到仓库..."
    
    if [[ -z "$REGISTRY" ]]; then
        log_error "未配置镜像仓库地址"
        exit 1
    fi
    
    # 重新标记镜像
    local remote_image="$REGISTRY/$NAMESPACE/$PROJECT_NAME"
    docker tag "$BUILT_IMAGE" "$remote_image:$(echo $BUILT_IMAGE | cut -d: -f2)"
    docker tag "$LATEST_IMAGE" "$remote_image:latest"
    
    # 推送镜像
    docker push "$remote_image:$(echo $BUILT_IMAGE | cut -d: -f2)"
    docker push "$remote_image:latest"
    
    log_success "镜像推送完成"
}

# 清理旧镜像
clean_images() {
    log_info "清理旧镜像..."
    
    # 清理悬空镜像
    docker image prune -f
    
    # 清理旧的项目镜像（保留最新的3个版本）
    local project_images=$(docker images --format "table {{.Repository}}:{{.Tag}}" | grep "${PROJECT_NAME:-wukongim-docs}" | grep -v latest | tail -n +4)
    if [[ -n "$project_images" ]]; then
        echo "$project_images" | xargs docker rmi -f
    fi
    
    log_success "镜像清理完成"
}

# 主函数
main() {
    local environment="dev"
    local force=false
    local clean=false
    local no_cache=false
    local push=false
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -v|--version)
                echo "WuKongIM 文档部署脚本 v1.0.0"
                exit 0
                ;;
            -f|--force)
                force=true
                shift
                ;;
            -c|--clean)
                clean=true
                shift
                ;;
            --no-cache)
                no_cache=true
                shift
                ;;
            --push)
                push=true
                shift
                ;;
            dev|test|prod)
                environment=$1
                shift
                ;;
            *)
                log_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    log_info "开始部署到 $environment 环境..."
    
    # 执行部署流程
    check_dependencies
    load_env "$environment"
    
    if [[ "$clean" == "true" ]]; then
        clean_images
    fi
    
    build_image "$environment" "$force" "$no_cache"
    test_image
    
    if [[ "$push" == "true" ]]; then
        push_image
    fi
    
    log_success "部署完成！"
    echo ""
    echo "镜像信息:"
    echo "  本地镜像: $LATEST_IMAGE"
    if [[ "$push" == "true" ]]; then
        echo "  远程镜像: $REGISTRY/$NAMESPACE/$PROJECT_NAME:latest"
    fi
    echo ""
    echo "启动命令:"
    echo "  docker run -d -p 80:80 $LATEST_IMAGE"
}

# 执行主函数
main "$@"
