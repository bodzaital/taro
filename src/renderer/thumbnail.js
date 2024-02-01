import Control from "./control";
import { folder } from "./folder";
import { description } from "./metadata/description";
import { $, $$ } from "./shorthand";
import { sidebar } from "./sidebar";
import { windowFrame } from "./windowFrame";

class Thumbnail {
	static #NAVIGATION_LEFT_KEYS = ["ArrowLeft"];
	static #NAVIGATION_RIGHT_KEYS = ["ArrowRight"];

	static #NAVIGATION_KEYS = [
		...Thumbnail.#NAVIGATION_LEFT_KEYS,
		...Thumbnail.#NAVIGATION_RIGHT_KEYS
	];

	#container = $(".thumbnail-container");
	activePhoto = $("#activePhoto");
	#currentIndex = 0;
	#thumbnailsToggleButton = $("#thumbnailsToggleButton");
	#isThumbnailsOpen = true;

	constructor() {
		this.#container.addEventListener("click", (e) => {
			if (!folder.isFolderLoaded) return;

			const shouldNavigate = this.#navigateOnClick(e);
			if (!shouldNavigate) return;

			this.selectPhoto(this.#currentIndex);
		});

		window.addEventListener("keydown", (e) => {
			if (!folder.isFolderLoaded) return;
			if (windowFrame.isSearchActive) return;
			if (description.isEditing()) return;
			
			const shouldNavigate = this.#navigateOnScroll(e);
			if (!shouldNavigate) return;

			this.selectPhoto(this.#currentIndex);
		});

		this.#thumbnailsToggleButton.addEventListener("click", () => {
			this.toggleThumbnail(!this.#isThumbnailsOpen);
			
			window.ipc.saveSetting("isThumbnailsVisible", this.#isThumbnailsOpen);
		});

		window.addEventListener("folderLoaded", () => {
			this.loadFolder(folder.folderInfo.imageURIs);
		});

		window.addEventListener("folderUnloaded", () => {
			this.unloadFolder();
		});
	}

	toggleThumbnail(state) {
		this.#isThumbnailsOpen = state;
		
		if (this.#isThumbnailsOpen) {
			windowFrame.content.classList.remove("no-thumbnails");
			this.#thumbnailsToggleButton.classList.add("active");
		} else {
			windowFrame.content.classList.add("no-thumbnails");
			this.#thumbnailsToggleButton.classList.remove("active");
		}
	}

	#navigateOnClick(e) {
		const clickedThumbnail = e.target.closest(".thumbnail");
		if (clickedThumbnail == null) return;

		const selectedIndex = Array.from($$(".thumbnail")).indexOf(clickedThumbnail);

		return this.#updateCurrentIndex(selectedIndex);
	}

	#navigateOnScroll(e) {	
		if (!Thumbnail.#NAVIGATION_KEYS.includes(e.key)) return false;
		e.preventDefault();

		let selectedIndex = this.#currentIndex;

		this.bidirectionalNavigation(e.key, () => {
			selectedIndex = this.#advanceIndexWithClamp(-1);
		}, () => {
			selectedIndex = this.#advanceIndexWithClamp(1);
		});

		return this.#updateCurrentIndex(selectedIndex);
	}

	#updateCurrentIndex(selectedIndex) {
		if (this.#currentIndex == selectedIndex) return false;

		this.#currentIndex = selectedIndex;
		return true;
	}

	/** Calls the previous or next callback functions depending on if the pressed key is part of the left or right navigation keys. */
	bidirectionalNavigation(key, prevCallback, nextCallback) {
		if (Thumbnail.#NAVIGATION_LEFT_KEYS.includes(key)) prevCallback();
		if (Thumbnail.#NAVIGATION_RIGHT_KEYS.includes(key)) nextCallback();
	}

	/** Advances the index left or right by the delta, clamped to the legal values of photo indexes. */
	#advanceIndexWithClamp(delta) {
		const lastIndex = $$(".thumbnail").length - 1;
		return Math.min(Math.max(this.#currentIndex + delta, 0), lastIndex);
	}

	/** Deselects the current thumbnail and selects a new thumbnail by index. */
	selectPhoto(index = 0) {
		const currentThumbnail = $(".thumbnail.current");
		if (currentThumbnail != null) currentThumbnail.classList.remove("current");
	
		const selectedThumbnail = $$(".thumbnail")[index];
		selectedThumbnail.classList.add("current");
		selectedThumbnail.scrollIntoView();
		
		this.activePhoto.style.backgroundImage = `url('${selectedThumbnail.src}')`;

		sidebar.loadExifData(selectedThumbnail.dataset.rawSrc);
		sidebar.loadMetadata(selectedThumbnail.dataset.name);
		sidebar.photoName.innerText = selectedThumbnail.dataset.name;
	}

	/** Creates the thumbnails from the collection of image URIs. */
	createThumbnails(imageUris) {
		imageUris
			.map((uri) => this.#createThumbnail(uri))
			.forEach((thumbnail) => this.#container.appendChild(thumbnail));
	}

	loadFolder(imageUris) {
		this.createThumbnails(imageUris);
		this.selectPhoto();
		this.activePhoto.classList.remove("d-none");
	}

	unloadFolder() {
		this.clearThumbnails();
		this.clearPhoto();
		this.activePhoto.classList.add("d-none");
	}

	#createThumbnail(uri) {
		return new Control("img")
			.add("src", `taro://${uri}`)
			.add("loading", "lazy")
			.class("thumbnail")
			.data("rawSrc", uri)
			.data("name", this.#getFilenameFromUri(uri).toUpperCase())
			.get();
	}

	#getFilenameFromUri(uri) {
		const regex = /.+\/(.+)$/;
		const withExtension = uri.match(regex)[1];
		const sansExtension = withExtension.substring(0, withExtension.indexOf("."));

		return sansExtension
	}

	clearThumbnails() {
		this.#container.innerText = "";
	}
	
	clearPhoto() {
		this.activePhoto.style.backgroundImage = "";
	}
}

export const thumbnail = new Thumbnail();