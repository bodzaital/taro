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

			this.#navigateOnClick(e);
			this.selectPhoto(this.#currentIndex);
		});

		window.addEventListener("keydown", (e) => {
			if (!folder.isFolderLoaded) return;

			this.#navigateOnScroll(e);
			this.selectPhoto(this.#currentIndex);
		});
	}

	#navigateOnClick(e) {
		const clickedThumbnail = e.target.closest(".thumbnail");
		if (clickedThumbnail == null) return;

		const selectedIndex = Array.from($$(".thumbnail")).indexOf(clickedThumbnail);
		this.#currentIndex = selectedIndex;
	}

	#navigateOnScroll(e) {
		if (!Thumbnail.#NAVIGATION_KEYS.includes(e.key)) return;		
		e.preventDefault();

		this.bidirectionalNavigation(e.key, () => {
			this.#currentIndex = this.#advanceIndexWithClamp(-1);
		}, () => {
			this.#currentIndex = this.#advanceIndexWithClamp(1);
		});
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
				exif.ExposureTime.description,
				fnumber,
				exif.ISOSpeedRatings.description
			);
			
			console.log(exif);
		});

		// $("#showExif").addEventListener("click", () => {
		// 	const exifModal = new bootstrap.Modal($("#exif-modal"));
		// 	exifModal.show();			

		// 	// TODO: refresh modal on exit?
		// 	// FIXME: bug on second modal: backdrop remains, lol
		// 	// TODO: separate into load exif data and show exif data.
		// 	window.ipc.getExif(uri).then((exif) => {
		// 		$("#exif-modal .exif-loading").classList.add("d-none");
		// 		$("#exif-modal .table").classList.remove("d-none");

		// 		console.log(exif);
				
		// 		$("#exif-camera-model").innerText = "Canon EOS R8";
		// 		$("#exif-lens-model").innerText = "Canon RF 50mm f/1.8 STM";
		// 		$("#exif-focal-length").innerText = "50mm";
		// 		$("#exif-f-number").innerText = "f/2.8";
		// 		$("#exif-exposure-time").innerText = "1/2000s";
		// 	});
		// });
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