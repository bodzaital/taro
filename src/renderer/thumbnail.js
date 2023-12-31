import { $ } from "./shorthand";

const container = $(".thumbnail-container");
const photo = $("#activePhoto");

container.addEventListener("click", (e) => {
	const nearest = e.target.closest("img");
	if (nearest == null) return;

	selectThumbnail(nearest);
	showSelectedThumbnail();
});

export function selectThumbnail(nextThumbnail) {
	const activeThumbnail = $(".thumbnail.active");
	activeThumbnail.classList.remove("active");

	nextThumbnail.classList.add("active");
}

export function selectFirstThumbnail() {
	const thumbnail = $(".thumbnail");
	thumbnail.classList.add("active");
}

export function showSelectedThumbnail() {
	const activeThumbnail = $(".thumbnail.active");
	photo.style.backgroundImage = `url('${activeThumbnail.src}')`;
}

/** Create the thumbnails from a list of URIs and select the first thumbnail. */
export function createThumbnails(listOfImageUris) {
	const listOfThumbnails = listOfImageUris.map((uri) => createThumbnail(uri));

	listOfThumbnails
		.forEach((thumbnail) => container.appendChild(thumbnail));
}

function createThumbnail(uri) {
	const thumbnail = document.createElement("img");

	thumbnail.src = `fab://${uri}`;
	thumbnail.classList.add("thumbnail");

	return thumbnail;
}