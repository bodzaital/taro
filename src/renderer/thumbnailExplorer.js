export function selectThumbnail(thumbnail) {
	document.querySelector(".thumbnail.active").classList.remove("active");

	thumbnail.classList.add("active");
	loadActivePhoto(thumbnail);
}

export function loadActivePhoto() {
	const activeThumbnail = document.querySelector(".thumbnail.active");
	if (activeThumbnail == null) return;
	
	const activePhoto = document.querySelector("#activePhoto");
	activePhoto.style.backgroundImage = `url('${activeThumbnail.src}')`;
}