<template>
	<div class="home-preview-block">
		<div class="home-preview">
			<h2>截图预览</h2>
			<div class="items">
				<div class="item">
					<img data-fancybox="gallery" src="/imgs/screen1.png" />
				</div>
				<div class="item">
					<img data-fancybox="gallery" src="/imgs/screen2.png" />
				</div>
				<div class="item">
					<img data-fancybox="gallery" src="/imgs/screen3.png" />
				</div>
				<div class="item">
					<img data-fancybox="gallery" src="/imgs/screen4.png" />
				</div>
				<div class="item">
					<img data-fancybox="gallery" src="/imgs/screen5.png" />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.home-preview-block {
	padding: 0 24px;
}

.home-preview {
	max-width: 1152px;
	margin: 50px auto 0;
}

.home-preview h2 {
	font-size: 24px;
	font-weight: bold;
	margin-bottom: 20px;
	text-align: center;
}

.home-preview .items {
	display: flex;
	flex-wrap: wrap;
	margin: -8px;
}

.home-preview .items .item {
	width: 100%;
	padding: 8px;
}

.home-preview .items .item img {
	width: 100%;
	height: 100%;
	cursor: pointer;
}

.home-preview .items .item p {
	padding: 24px;
	border-radius: 12px;
	background-color: var(--vp-c-bg-soft);
}

.home-preview .items .item p :deep(img) {
	border: 1px solid var(--vp-c-divider);
}

@media (min-width: 640px) {
	.home-preview-block {
		padding: 0 48px;
	}

	.home-preview .items .item {
		width: calc(100% / 2);
	}
}

@media (min-width: 960px) {
	.home-preview-block {
		padding: 0 64px;
	}

	.home-preview .items .item {
		width: calc(100% / 3);
	}
}
</style>
