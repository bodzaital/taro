import { AppSettingsConstant } from "../data/appsettingsConstants";
import Control from "./control";
import { folder } from "./folder";
// import { description } from "./metadata/description";
// import { exif } from "./metadata/exif";
// import { location } from "./metadata/location";
// import { metadata } from "./metadata/metadata";
// import { tagging } from "./metadata/tagging";
import { $, $$ } from "./utility/shorthand";
// import { sidebar } from "./sidebar";
import { windowFrame } from "./windowFrame";
import { photoNavigation } from "./photoNavigation";

class Thumbnails {
	#container = $(".thumbnail-container");
	#thumbnailsToggleButton = $("#toggleThumbnails");
	#isThumbnailsOpen = true;

	constructor() {
		this.#container.addEventListener("click", (e) => photoNavigation.select("click", e));
		window.addEventListener("keydown", (e) => photoNavigation.select("key", e));

		this.#thumbnailsToggleButton.addEventListener("click", () => {
			window.invoke.saveSetting("isThumbnailsVisible", !this.#isThumbnailsOpen);
		});
		
		window.listen.applySetting((key, value) => {
			if (key == AppSettingsConstant.THUMBNAILS_VISIBLE) this.toggleThumbnail(value);
		});
		
		window.addEventListener("folderLoaded", () => this.loadFolder(folder.listOfImageURIs));
		window.addEventListener("folderUnloaded", () => this.unloadFolder());
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

	/** Creates the thumbnails from the collection of image URIs. */
	createThumbnails(imageUris) {
		imageUris
			.map((uri) => this.#createThumbnail(uri))
			.forEach((thumbnail) => this.#container.appendChild(thumbnail));
	}

	loadFolder(imageUris) {
		this.createThumbnails(imageUris);
		photoNavigation.selectPhoto();
	}

	unloadFolder() {
		this.clearThumbnails();
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
}

export const thumbnails = new Thumbnails();