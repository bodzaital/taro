import { $, $$ } from "./shorthand";

class Tagging {
	#tagContainer = $(".sidebar-tag-container");
	#tagAdderInput = $(".sidebar-tag-add");
	#tagSuggestions = $(".sidebar-tag-suggestions");

	#suggestedTags__DUMMY_DONT_RELEASE = ["landscape", "ambient", "happy"];

	constructor() {
		console.log(this.#getTags());
		this.#clearSuggestions();
		this.#clearTags();

		this.#tagAdderInput.addEventListener("focus", () => {
			// TODO: dynamically suggest tags based on what was written in
			this.#suggestedTags__DUMMY_DONT_RELEASE.forEach((tag) => this.#addSuggestion(tag));
		});

		this.#tagAdderInput.addEventListener("focusout", () => {
			this.#clearSuggestions();
		});

		this.#tagSuggestions.addEventListener("click", (e) => {
			// TODO: tags must be unique on a photo.
			const nearest = e.target.closest(".sidebar-tag-suggestions a");
			if (nearest == null) return;

			const tagName = nearest.innerText;
			this.#addTag(tagName);

			this.#clearSuggestions();
		});

		this.#tagContainer.addEventListener("click", (e) => {
			const nearest = e.target.closest(".sidebar-tag-remove");
			if (nearest == null) return;

			const tagName = $(".sidebar-tag-name", nearest.parent).innerText;

			this.#removeTag(tagName);
		});
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

		tag.dataset.tag = name;
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

	#removeTag(name) {
		const tagSelector = `.sidebar-tag[data-tag='${name}']`;
		this.#tagContainer.removeChild($(tagSelector, this.#tagContainer));
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