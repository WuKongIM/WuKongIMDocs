# WuKongIM 文档项目 Dockerfile
# 基于 nginx alpine 镜像，轻量且安全
FROM nginx:1.25-alpine

# 设置维护者信息
LABEL maintainer="WuKongIM Team"
LABEL description="WuKongIM Documentation Website"
LABEL version="1.0"

# 安装必要的工具和依赖
RUN apk add --no-cache \
    curl \
    tzdata \
    && rm -rf /var/cache/apk/*

# 设置时区为中国时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 创建非 root 用户以提高安全性
RUN addgroup -g 1001 -S wukongim && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G wukongim -g wukongim wukongim

# 创建必要的目录并设置权限
RUN mkdir -p /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    chown -R wukongim:wukongim /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# 复制网站文件到 nginx 默认目录
COPY . /usr/share/nginx/html/

# 设置正确的文件权限
RUN chown -R wukongim:wukongim /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# 创建健康检查脚本
RUN echo '#!/bin/sh' > /usr/local/bin/healthcheck.sh && \
    echo 'curl -f http://localhost:80/ || exit 1' >> /usr/local/bin/healthcheck.sh && \
    chmod +x /usr/local/bin/healthcheck.sh

# 健康检查配置
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD /usr/local/bin/healthcheck.sh

# 暴露端口
EXPOSE 80

# 切换到非 root 用户
USER wukongim

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
