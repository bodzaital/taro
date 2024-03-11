import { description } from "./metadata/description";
import { folder } from "./folder";
import { exif } from "./metadata/exif";
import { location } from "./metadata/location";
import { metadata } from "./metadata/metadata";
import { tagging } from "./metadata/tagging";
import { sidebar } from "./sidebar";
import { $, $$ } from "./utility/shorthand";
import { windowFrame } from "./windowFrame";

class PhotoNavigation {
	#leftKeys = ["ArrowLeft"];
	#rightKeys = ["ArrowRight"];

	#keys = [
		...this.#leftKeys,
		...this.#rightKeys,
	];

	#currentIndex = 0;
	#photo = $("#activePhoto");

	constructor() {
		window.addEventListener("folderLoaded", () => this.#loadFolder());
		window.addEventListener("folderUnloaded", () => this.#unloadFolder());
	}

	/** Selects the next photo by navigating the current index. */
	select(type, e) {
		if (this.#isNavigationBlocked(type)) return;
		if (!this.#navigate(type, e)) return;

		this.selectPhoto(this.#currentIndex);
	}

	/** Selects a new photo by index. Defaults to the first in the photo array. */
	selectPhoto(index = 0) {
		const current = $(".thumbnail.current");
		if (current != null) current.classList.remove("current");

		const selected = $$(".thumbnail")[index];
		selected.classList.add("current");
		selected.scrollIntoView();

		const fileInfo = JSON.parse(selected.dataset.fileinfo);

		this.#photo.style.backgroundImage = `url('${selected.src}')`;

		metadata.loadMetadata(fileInfo.name);
		sidebar.setPhotoName(fileInfo.name);
		exif.loadData(fileInfo.uri);
	}

	/** Navigates by type and returns true if the index was updated. */
	#navigate(type, e) {
		return type == "click"
			? this.#navigateByClick(e)
			: this.#navigateByKey(e);
	}

	#navigateByClick(e) {
		const clickedThumbnail = e.target.closest(".thumbnail");
		if (clickedThumbnail == null) return;

		const nextIndex = Array.from($$(".thumbnail")).indexOf(clickedThumbnail);
		return this.#updateIndex(nextIndex);
	}

	#navigateByKey(e) {
		if (!this.#keys.includes(e.key)) return false;
		e.preventDefault();

		let nextIndex = this.#currentIndex;

		if (this.#leftKeys.includes(e.key)) {
			nextIndex = this.#clampIndex(-1);
		}

		if (this.#rightKeys.includes(e.key)) {
			nextIndex = this.#clampIndex(1);
		}

		return this.#updateIndex(nextIndex);
	}

	/** Clamps the index + delta to legal index values in the photo array. */
	#clampIndex(delta) {
		const lastLegalIndex = $$(".thumbnail").length - 1;
		return Math.min(Math.max(this.#currentIndex + delta, 0), lastLegalIndex);
	}

	/** Returns true if the index was updated. */
	#updateIndex(index) {
		if (this.#currentIndex == index) return false;

		this.#currentIndex = index;
		return true;
	}

	/** Checks if navigation is allowed or not. */
	#isNavigationBlocked(type) {
		return type == "click"
			? this.#isNavigationBlockedForClick()
			: this.#isNavigationBlockedForKey();
	}

	#isNavigationBlockedForClick() {
		return !folder.isFolderLoaded;
	}

	#isNavigationBlockedForKey() {
		return !folder.isFolderLoaded ||
			windowFrame.isSearchActive ||
			description.isEditing() ||
			tagging.isInputActive() ||
			location.isEditing();
	}

	/** Turns on the photo when the folder is loaded. */
	#enablePhoto() {
		this.#photo.classList.remove("d-none");
	}

	/** Turns off the photo when the folder is unloaded. */
	#disablePhoto() {
		this.#photo.style.backgroundImage = "";
		this.#photo.classList.add("d-none");
	}

	#loadFolder() {
		this.#enablePhoto();
	}

	#unloadFolder() {
		this.#disablePhoto();
	}
}

export const photoNavigation = new PhotoNavigation();