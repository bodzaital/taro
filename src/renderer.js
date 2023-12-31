import './index.scss';
import { clearPhoto, displayPhoto, nextNavigator, prevNavigator, selectPhoto, setNavigatorState } from './renderer/navigator';
import { $ } from './renderer/shorthand';

const thumbnailContainer = $(".thumbnail-container");

// On startup no folder is selected, so disable the navigators.
setNavigatorState(prevNavigator, "disabled");
setNavigatorState(nextNavigator, "disabled");

window.ipc.loadImages((listOfImageUris) => {
	createThumbnails(listOfImageUris);
	displayPhoto()
});

window.ipc.closeFolder(() => {
	clearThumbnails();
	clearPhoto();
});

thumbnailContainer.addEventListener("click", (e) => {
	const nearest = e.target.closest("img");
	if (nearest == null) return;
	
	selectPhoto(nearest);
});

function clearThumbnails() {
	$(".thumbnail-container").innerText = "";
}

function createThumbnails(listOfImageUris) {
	const listOfPhotoItems = listOfImageUris
		.map((image) => createThumbnail(image));

	listOfPhotoItems[0].classList.add("active");

	listOfPhotoItems.forEach((photoItem) => thumbnailContainer.appendChild(photoItem));

	setNavigatorState(prevNavigator, "enabled");
	setNavigatorState(nextNavigator, "enabled");
}

function createThumbnail(imageUri) {
	const photoImage = document.createElement("img");

	photoImage.src = `fab://${imageUri}`;
	photoImage.classList.add("thumbnail");

	return photoImage;
}