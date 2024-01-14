import { folder } from "./folder";
import { $, $$ } from "./shorthand";

class Thumbnail {
	#container = $(".thumbnail-container");
	#activePhoto = $("#activePhoto");
	#currentIndex = 0;

	constructor() {
		// TODO: refactor shared code between click and keydown.
		this.#container.addEventListener("click", (e) => {
			if (!folder.isFolderLoaded) return;

			const selectedThumbnail = e.target.closest(".thumbnail");
			if (selectedThumbnail == null) return;

			const selectedIndex = Array.from($$(".thumbnail")).indexOf(selectedThumbnail);
			this.#currentIndex = selectedIndex;
			
			this.selectThumbnail(selectedIndex);
			const uri = this.showSelectedThumbnail();
			this.#loadExifForUri(uri);
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
			
			const uri = this.showSelectedThumbnail();
			this.#loadExifForUri(uri);
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
		return selectedThumbnail.src;
	}

	#loadExifForUri(uri) {
		$("#showExif").addEventListener("click", () => {
			const exifModal = new bootstrap.Modal($("#exif-modal"));
			exifModal.show();			

			// TODO: refresh modal on exit?
			// FIXME: bug on second modal: backdrop remains, lol
			// TODO: separate into load exif data and show exif data.
			window.ipc.getExif(uri).then((exif) => {
				$("#exif-modal .exif-loading").classList.add("d-none");
				$("#exif-modal .table").classList.remove("d-none");

				console.log(exif);
				
				$("#exif-camera-model").innerText = "Canon EOS R8";
				$("#exif-lens-model").innerText = "Canon RF 50mm f/1.8 STM";
				$("#exif-focal-length").innerText = "50mm";
				$("#exif-f-number").innerText = "f/2.8";
				$("#exif-exposure-time").innerText = "1/2000s";
			});
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
		this.selectThumbnail(0);
		this.showSelectedThumbnail();
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