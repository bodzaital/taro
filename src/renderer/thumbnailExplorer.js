export function selectThumbnail(thumbnail) {
	document.querySelector(".thumbnail.active").classList.remove("active");

	thumbnail.classList.add("active");
}