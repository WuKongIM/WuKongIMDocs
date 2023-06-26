export function fetchReleaseTag() {
	const releaseTag = "1.0.0";
	const tagLineParagragh = document.querySelector("div.VPHero.has-image.VPHomeHero > div > div.main > p.tagline");
	const docsReleaseTagSpan = document.createElement("samp");
	docsReleaseTagSpan.classList.add("docs-cn-github-release-tag");
	docsReleaseTagSpan.innerText = releaseTag;
	tagLineParagragh?.appendChild(docsReleaseTagSpan);
}
