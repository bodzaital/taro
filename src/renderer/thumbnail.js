import { folder } from "./folder";
import { $, $$ } from "./shorthand";

class Thumbnail {
	static #NAVIGATION_LEFT_KEYS = ["ArrowLeft"];
	static #NAVIGATION_RIGHT_KEYS = ["ArrowRight"];

	static #NAVIGATION_KEYS = [
		...Thumbnail.#NAVIGATION_LEFT_KEYS,
		...Thumbnail.#NAVIGATION_RIGHT_KEYS
	];

	#container = $(".thumbnail-container");
	#activePhoto = $("#activePhoto");
	#currentIndex = 0;

	constructor() {
		this.#clearSidebarExifData();

		this.#container.addEventListener("click", (e) => {
			if (!folder.isFolderLoaded) return;

			const shouldNavigate = this.#navigateOnClick(e);
			if (!shouldNavigate) return;

			this.selectPhoto(this.#currentIndex);
		});

		window.addEventListener("keydown", (e) => {
			if (!folder.isFolderLoaded) return;
			
			const shouldNavigate = this.#navigateOnScroll(e);
			if (!shouldNavigate) return;

			this.selectPhoto(this.#currentIndex);
		});
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
		
		this.#activePhoto.style.backgroundImage = `url('${selectedThumbnail.src}')`;

		this.#loadExifForUri(selectedThumbnail.dataset.rawSrc);
	}

	#clearSidebarExifData() {
		const sidebarExifShutter = $("#sidebarExifShutter");
		const sidebarExifAperture = $("#sidebarExifAperture");
		const sidebarExifIso = $("#sidebarExifIso");

		sidebarExifShutter.innerText = "";
		sidebarExifAperture.innerText = "";
		sidebarExifIso.innerText = "";

		const placeholder = document.createElement("div");
		placeholder.classList.add("placeholder");
		placeholder.style.width = "100%";

		sidebarExifShutter.appendChild(placeholder.cloneNode());
		sidebarExifAperture.appendChild(placeholder.cloneNode());
		sidebarExifIso.appendChild(placeholder.cloneNode());
	}

	#setSidebarExifData(shutter, aperture, iso) {
		const sidebarExifShutter = $("#sidebarExifShutter");
		const sidebarExifAperture = $("#sidebarExifAperture");
		const sidebarExifIso = $("#sidebarExifIso");

		sidebarExifShutter.innerText = `${shutter}s`;
		sidebarExifAperture.innerText = `ƒ/${aperture}`;
		sidebarExifIso.innerText = iso;
	}

	#loadExifForUri(uri) {
		this.#clearSidebarExifData();

		window.ipc.getExif(uri).then((exif) => {
			const fnumber = exif.FNumber.value[0] / exif.FNumber.value[1];
			this.#setSidebarExifData(
				exif.ShutterSpeedValue.description,
				fnumber,
				exif.ISOSpeedRatings.description
			);
			
			console.log(exif);
		});
	}

	/** Creates the thumbnails from the collection of image URIs. */
	createThumbnails(imageUris) {
		imageUris
			.map((uri) => this.#createThumbnail(uri))
			.forEach((thumbnail) => this.#container.appendChild(thumbnail));
	}

	/** Calls the necessary instance functions when a folder is loaded. */
	loadFolder(imageUris) {
		this.createThumbnails(imageUris);
		this.selectPhoto();
	}

	/** Calls the necessary instance functions when a folder is unloaded. */
	unloadFolder() {
		this.clearThumbnails();
		this.clearPhoto();
	}

	#createThumbnail(uri) {
		const thumbnail = document.createElement("img");
	
		thumbnail.src = `taro://${uri}`;
		thumbnail.loading = "lazy";
		thumbnail.classList.add("thumbnail");
		thumbnail.dataset.rawSrc = uri;
	
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