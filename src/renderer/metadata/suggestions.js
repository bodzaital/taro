import Control from "../control";
import { folder } from "../folder";
import { $ } from "../shorthand";
import { metadata } from "./metadata";
import { tagging } from "./tagging";

// TODO: tagging/suggestions refactor.
// TODO: close/open suggestions when needed.
class Suggestions {
	static #SUGGESTION_LIMIT = 5;
	static #SELECT_UP_KEYS = ["ArrowUp"];
	static #SELECT_DOWN_KEYS = ["ArrowDown"];
	
	static #SELECTION_KEYS = [
		...this.#SELECT_UP_KEYS,
		...this.#SELECT_DOWN_KEYS
	];

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

		window.addEventListener("keydown", (e) => this.#selectSuggestions(e, true));
		window.addEventListener("keyup", (e) => this.#selectSuggestions(e));
	}

	getSelectedSuggestion() {
		const active = $(".active", this.#container);
		if (active == null) return "";

		return active.innerText;
	}
	
	#selectSuggestions(event, isKeyDown = false) {
		if (!this.isOpen) return;
		if (!Suggestions.#SELECTION_KEYS.includes(event.key)) return;
		
		// Preventing caret positioning is only on keydown event.
		event.preventDefault();
		if (isKeyDown) return;

		const selected = $(".active", this.#container);

		if (Suggestions.#SELECT_UP_KEYS.includes(event.key)) {
			const previous = selected.previousElementSibling;
			if (previous == null) return;

			selected.classList.remove("active");
			previous.classList.add("active");
			
			return;
		}

		if (Suggestions.#SELECT_DOWN_KEYS.includes(event.key)) {
			const next = selected.nextElementSibling;
			if (next == null) return;

			selected.classList.remove("active");
			next.classList.add("active");
			
			return;
		}
	}
	
	async #getSuggestions(value = null) {
		if (value == null || value.length == 0) return null;
		
		return await window.invoke.getEveryTag(folder.folderInfo.folderPath).then((tags) => {
			return tags.filter((x) => x.includes(value)).slice(0, Suggestions.#SUGGESTION_LIMIT);
		});
	}

	async showSuggestions(value = null) {
		this.hideSuggestions();

		this.#tagList = await this.#getSuggestions(value);
		if (this.#tagList == null) return;

		this.#tagList = this.#tagList.filter((x) => !metadata.hasTag(x));

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