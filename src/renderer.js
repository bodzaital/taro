import './index.scss';
import { loadActivePhoto, selectThumbnail } from './renderer/thumbnailExplorer';

const photosetContainer = document.querySelector(".thumbnail-container");

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
}

function createThumbnail(imageUri) {
	const photoImage = document.createElement("img");

	photoImage.src = `fab://${imageUri}`;
	photoImage.classList.add("thumbnail");

	return photoImage;
}