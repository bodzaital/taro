import { folder } from "./folder";
import { $, $$ } from "./shorthand";

class Thumbnail {
	#container = $(".thumbnail-container");
	#activePhoto = $("#activePhoto");
	#currentIndex = 0;

	constructor() {
		this.#container.addEventListener("click", (e) => {
			if (!folder.isFolderLoaded) return;

			const selectedThumbnail = e.target.closest(".thumbnail");
			if (selectedThumbnail == null) return;

			const selectedIndex = Array.from($$(".thumbnail")).indexOf(selectedThumbnail);
			this.#currentIndex = selectedIndex;
			
			this.selectThumbnail(selectedIndex);
			this.showSelectedThumbnail();
		});

		window.addEventListener("keydown", (e) => {
			if (!folder.isFolderLoaded) return;

			if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
			
			e.preventDefault();

			this.#navigate(e.key, () => {
				this.#advanceIndexWithClamp(-1);
			}, () => {
				this.#advanceIndexWithClamp(1);
			});
			
			let selectedThumbnail = this.selectThumbnail(this.#currentIndex);
			selectedThumbnail.scrollIntoView();
			
			this.showSelectedThumbnail();
		});
	}

	#navigate(key, prevCallback, nextCallback) {
		if (key == "ArrowLeft") prevCallback();
		if (key == "ArrowRight") nextCallback();
	}

	#advanceIndexWithClamp(delta) {
		const lastIndex = $$(".thumbnail").length - 1;
		this.#currentIndex = Math.min(Math.max(this.#currentIndex + delta, 0), lastIndex);
	}

	/** Deselects the current thumbnail and selects a new thumbnail by index. */
	selectThumbnail(index) {
		const currentThumbnail = $(".thumbnail.current");
		if (currentThumbnail != null) currentThumbnail.classList.remove("current");
	
		const selectedThumbnail = $$(".thumbnail")[index];
		selectedThumbnail.classList.add("current");

		return selectedThumbnail;
	}

	/** Shows the selected thumbnail as the active photo. */
	showSelectedThumbnail() {
		const selectedThumbnail = $(".thumbnail.current");
		this.#activePhoto.style.backgroundImage = `url('${selectedThumbnail.src}')`;
	}

	/** Creates the thumbnails from the collection of image URIs. */
	createThumbnails(imageUris) {
		imageUris
			.map((uri) => this.#createThumbnail(uri))
			.forEach((thumbnail) => this.#container.appendChild(thumbnail));
	}

	#createThumbnail(uri) {
		const thumbnail = document.createElement("img");
	
		thumbnail.src = `fab://${uri}`;
		thumbnail.classList.add("thumbnail");
	
		return thumbnail;
	}

	clearThumbnails() {
		this.#container.innerText = "";
	}
	
	clearPhoto() {
		this.#activePhoto.style.backgroundImage = "";
	}
}

export const thumbnail = new Thumbnail();