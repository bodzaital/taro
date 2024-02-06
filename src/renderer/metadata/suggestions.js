import Control from "../control";
import { folder } from "../folder";
import { $ } from "../shorthand";
import { sidebar } from "../sidebar";
import { tagging } from "./tagging";

class Suggestions {
	static #SUGGESTION_LIMIT = 5;

	isOpen = false;

	#tagList = null;
	#container = $(".tag-suggestions-container .list-group");

	constructor() {
		this.#container.addEventListener("click", (e) => {
			const nearest = e.target.closest("button.list-group-item-action");
			if (nearest == null) return;

			const tagName = nearest.innerText;
			const addedTag = tagging.tryAddTag(tagName);
			if (addedTag) this.hideSuggestions();
		});

		window.addEventListener("keyup", (e) => {
			if (!this.isOpen) return;
			
			// TODO: allow selecting by arrows.
		});
	}
	
	async #getSuggestions(value = null) {
		if (value == null || value.length == 0) return null;
		
		return await window.ipc.getAllTags(folder.folderInfo.folderPath).then((tags) => {
			return tags.filter((x) => x.includes(value)).slice(0, Suggestions.#SUGGESTION_LIMIT);
		});
	}

	async showSuggestions(value = null) {
		this.hideSuggestions();

		this.#tagList = await this.#getSuggestions(value);
		if (this.#tagList == null) return;

		this.#tagList = this.#tagList.filter((x) => !sidebar.metadata.tags.includes(x));

		if (!this.#tagList.includes(value)) this.#tagList = [value, ...this.#tagList];

		const items = this.#tagList.map((x) => this.#createItem(x));
		items[0].classList.add("active");

		items.forEach((x) => this.#insertItem(x));
		this.isOpen = true;
	}

	hideSuggestions() {
		this.#tagList = null;
		this.#container.innerText = "";
		this.isOpen = false;
	}

	selectSuggestion(tagName) {
		tagging.tryAddTag(tagName);
	}

	#insertItem(item) {
		this.#container.appendChild(item);
	}

	#createItem(tagName) {
		return new Control("button")
			.class("list-group-item", "list-group-item-action")
			.text(tagName)
			.get();
	}
}

export const suggestions = new Suggestions();