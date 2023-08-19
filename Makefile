build:
	docker build -t wukongimdocs .
deploy:
	docker build -t wukongimdocs  .
	docker tag wukongimdocs registry.cn-shanghai.aliyuncs.com/wukongim/wukongimdocs:latest
	docker push registry.cn-shanghai.aliyuncs.com/wukongim/wukongimdocs:latest