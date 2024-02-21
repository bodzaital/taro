import { folder } from "../folder";
import { description } from "./description";
import { location } from "./location";
import { rating } from "./rating";
import { tagging } from "./tagging";

class Metadata {
	#metadata = null;

	constructor() {
		window.addEventListener("folderLoaded", () => this.#loadFolder());
		window.addEventListener("folderUnloaded", () => this.#unloadFolder());
	}

	/** Loads the photo's metadata and calls the necessary functions to show the values. */
	loadMetadata(photoName) {
		window.invoke.getMetadata(folder.folderInfo.folderPath, photoName).then((data) => {
			this.#metadata = data;
			console.log("metadata.js loaded:", this.#metadata);

			rating.setRatingValue(this.#metadata.rating);
			description.setDescriptionValue(this.#metadata.description);
			tagging.createTags(...this.#metadata.tags);
			location.setLocationValue(this.#metadata.location);
		});
	}

	#writeMetadata() {
		window.invoke.writeMetadata(folder.folderInfo.folderPath, this.#metadata);
	}

	addTag(value) {
		this.#metadata.tags.push(value);
		this.#writeMetadata();
	}

	hasTag(value) {
		return this.#metadata.tags.includes(value);
	}

	canAddTag(value) {
		const hasTag = this.hasTag(value);
		const isEmpty = value.length == 0;

		return !hasTag && !isEmpty;
	}

	removeTag(value) {
		this.#metadata.tags = this.#metadata.tags.filter((x) => x != value);
		this.#writeMetadata();
	}

	setRating(value) {
		this.#metadata.rating = value;
		this.#writeMetadata();
	}

	setLocation(value) {
		this.#metadata.location = value;
		this.#writeMetadata();
	}

	setDescription(value) {
		this.#metadata.description = value;
		this.#writeMetadata();
	}

	#loadFolder() {

	}

	#unloadFolder() {
		this.#metadata = null;
	}
}

export const metadata = new Metadata();