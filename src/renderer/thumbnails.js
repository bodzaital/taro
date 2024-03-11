import { AppSettingsConstant } from "../data/appsettingsConstants";
import Control from "./control";
import { folder } from "./folder";
import { $, $$ } from "./utility/shorthand";
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
			window.invoke.saveSettings([
				{ "key": "isThumbnailsVisible", "value": !this.#isThumbnailsOpen }
			]);
		});
		
		window.listen.applySetting((key, value) => {
			if (key == AppSettingsConstant.THUMBNAILS_VISIBLE) this.#toggleThumbnail(value);
		});
		
		window.addEventListener("folderLoaded", () => this.#loadFolder(folder.listOfImageURIs));
		window.addEventListener("folderUnloaded", () => this.#unloadFolder());
	}

	#toggleThumbnail(state) {
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

	#clearThumbnails() {
		this.#container.innerText = "";
	}

	#loadFolder(imageUris) {
		this.createThumbnails(imageUris);
		photoNavigation.selectPhoto();
	}

	#unloadFolder() {
		this.#clearThumbnails();
	}
}

export const thumbnails = new Thumbnails();