build:
	docker build -t wukongimdocs . --platform linux/amd64
deploy:
	docker build -t wukongimdocs  . --platform linux/amd64
	docker tag wukongimdocs registry.cn-shanghai.aliyuncs.com/wukongim/wukongimdocs:latest
	docker push registry.cn-shanghai.aliyuncs.com/wukongim/wukongimdocs:latest