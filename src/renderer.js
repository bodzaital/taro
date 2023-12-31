import './index.scss';
import { cullNavigatorState, loadActivePhoto, selectThumbnail, toggleCullNavigators } from './renderer/thumbnailExplorer';

toggleCullNavigators("disabled");

const photosetContainer = document.querySelector(".thumbnail-container");
const prevButton = document.querySelector(".lhs a");
const nextButton = document.querySelector(".rhs a");

prevButton.addEventListener("click", (e) => {
	e.preventDefault();
	scrollPhotos("previous");
});

nextButton.addEventListener("click", (e) => {
	e.preventDefault();
	scrollPhotos("next");
});

function scrollPhotos(direction) {
	if (cullNavigatorState == "disabled") return;

	const currentImage = document.querySelector(".thumbnail.active");
	let nextToCull = currentImage.previousSibling;

	if (direction == "next") {
		nextToCull = currentImage.nextSibling;
	}
	
	selectThumbnail(nextToCull);
}

window.ipc.loadImages((listOfImageUris) => {
	createThumbnails(listOfImageUris);
});

window.ipc.closeFolder(() => {
	document.querySelector(".thumbnail-container").innerText = "";
});

photosetContainer.addEventListener("click", (e) => {
	const nearest = e.target.closest("img");
	if (nearest == null) return;
	
	selectThumbnail(nearest);
});

function createThumbnails(listOfImageUris) {
	const listOfPhotoItems = listOfImageUris
		.map((image) => createThumbnail(image));

	listOfPhotoItems[0].classList.add("active");

	listOfPhotoItems.forEach((photoItem) => photosetContainer.appendChild(photoItem));

	loadActivePhoto();
	toggleCullNavigators("enabled");
}

function createThumbnail(imageUri) {
	const photoImage = document.createElement("img");

	photoImage.src = `fab://${imageUri}`;
	photoImage.classList.add("thumbnail");

	return photoImage;
}