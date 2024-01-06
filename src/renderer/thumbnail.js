import { folder } from "./folder";
import { $, $$ } from "./shorthand";

const container = $(".thumbnail-container");
const photo = $("#activePhoto");

/** The currently selected thumbnail's index. */
let currentIndex = 0;

/** Handles navigation when clicking on thumbnails. */
container.addEventListener("click", (e) => {
	if (!folder.isFolderLoaded) return;

	const selectedThumbnail = e.target.closest(".thumbnail");
	if (selectedThumbnail == null) return;

	const selectedIndex = Array.from($$(".thumbnail")).indexOf(selectedThumbnail);

	selectThumbnail(selectedIndex);
	showSelectedThumbnail();
});

/** Handles navigation using keyboard arrow keys. */
window.addEventListener("keydown", (e) => {
	if (!folder.isFolderLoaded) return;

	navigate(e.key, () => {
		advanceIndexWithClamp(-1);
	}, () => {
		advanceIndexWithClamp(1);
	});
	
	selectThumbnail(currentIndex);
	showSelectedThumbnail();
});

/** Checks if a keypress is left or right arrow, and invokes the associated callbacks respectively. */
function navigate(key, prevCallback, nextCallback) {
	if (key == "ArrowLeft") prevCallback();
	if (key == "ArrowRight") nextCallback();
}

/** Advances the current thumbnail index while clamping it between 0 and the last item's index. */
function advanceIndexWithClamp(delta) {
	const lastValidIndex = $$(".thumbnail").length - 1;
	currentIndex = Math.min(Math.max(currentIndex + delta, 0), lastValidIndex);
}

/** Deselects the current thumbnail and selects a new thumbnail by index. */
export function selectThumbnail(index) {
	const currentThumbnail = $(".thumbnail.active");
	if (currentThumbnail != null) currentThumbnail.classList.remove("active");

	const selectedThumbnail = $$(".thumbnail")[index];
	selectedThumbnail.classList.add("active");
}

/** Shows the selected thumbnail as the active photo. */
export function showSelectedThumbnail() {
	const selectedThumbnail = $(".thumbnail.active");
	photo.style.backgroundImage = `url('${selectedThumbnail.src}')`;
}

/** Creates the thumbnails from the collection of image URIs. */
export function createThumbnails(imageUris) {
	imageUris
		.map((uri) => createThumbnail(uri))
		.forEach((thumbnail) => container.appendChild(thumbnail));
}

function createThumbnail(uri) {
	const thumbnail = document.createElement("img");

	thumbnail.src = `fab://${uri}`;
	thumbnail.classList.add("thumbnail");

	return thumbnail;
}