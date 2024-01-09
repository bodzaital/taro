import { $, $$ } from "./shorthand";

class Tagging {
	#tagContainer = $(".sidebar-tag-container");
	#tagAdderInput = $(".sidebar-tag-add");
	#tagSuggestions = $(".sidebar-tag-suggestions");

	constructor() {
		console.log(this.#getTags());
		this.#clearSuggestions();
		this.#clearTags();
	}
	
	#getTags() {
		return Array.from($$(".sidebar-tag"))
			.map((element) => $(".sidebar-tag-name", element).innerText);
	}

	#addTags(listOfNames) {
		listOfNames.forEach((name) => this.#addTag(name));
	}

	#addTag(name) {
		const tag = document.createElement("div");

		tag.classList.add("sidebar-tag");

		const tagName = document.createElement("div");
		tagName.classList.add("sidebar-tag-name");
		tagName.innerText = name

		tag.appendChild(tagName);

		const tagRemove = document.createElement("div");
		tagRemove.classList.add("sidebar-tag-remove");
		tagRemove.innerHTML = '<i class="bi bi-x-lg"></i>';

		tag.appendChild(tagRemove);

		this.#tagContainer.appendChild(tag);
	}

	#clearTags() {
		this.#tagContainer.innerText = "";
	}

	#addSuggestion(name) {
		const listGroupItem = document.createElement("a");
		
		listGroupItem.href = "#";
		listGroupItem.classList.add("list-group-item");
		listGroupItem.classList.add("list-group-item-action");
		listGroupItem.innerText = name;

		this.#tagSuggestions.appendChild(listGroupItem);
	}

	#clearSuggestions() {
		this.#tagSuggestions.innerText = "";
	}
}

export const tagging = new Tagging();