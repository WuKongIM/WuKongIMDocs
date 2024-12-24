FROM node:20.9.0 as builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json .
COPY pnpm-lock.yaml .
# https://registry.npmjs.org/  https://registry.npm.taobao.org
# RUN yarn config set registry https://registry.npm.taobao.org -g
# RUN yarn config set disturl https://npm.taobao.org/dist
RUN pnpm install
COPY . .
RUN pnpm build

FROM nginx:latest
COPY --from=builder /app/docker-entrypoint.sh /docker-entrypoint2.sh 
COPY --from=builder /app/nginx.conf.template /
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html
ENTRYPOINT ["sh", "/docker-entrypoint2.sh"]
CMD ["nginx","-g","daemon off;"]