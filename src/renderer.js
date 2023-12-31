import './index.scss';
import { selectThumbnail } from './renderer/thumbnailExplorer';

const openFolderButton = document.querySelector("#openFolderButton");
const photosetContainer = document.querySelector(".thumbnail-container");

window.ipc.loadImages((listOfImageUris) => {
	createThumbnails(listOfImageUris);
});

window.ipc.closeFolder(() => {
	document.querySelector(".thumbnail-container").innerText = "";
});

openFolderButton.addEventListener("click", () => {
	window.ipc.openFolder();
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
}

function createThumbnail(imageUri) {
	const photoImage = document.createElement("img");

	photoImage.src = `fab://${imageUri}`;
	photoImage.classList.add("thumbnail");

	return photoImage;
}