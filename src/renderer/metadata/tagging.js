import Control from "../control";
import { $ } from "../shorthand";

class Tagging {
	tagCloudContainer = $(".tag-cloud-container");
	tagSuggestionContainer = $(".tag-suggestion-container");

	constructor() {
		this.#insertTag(this.#createTag("forest"));
		this.#insertTag(this.#createTag("path"));
		this.#insertTag(this.#createTag("woman"));
		this.#insertTag(this.#createTag("sun"));
		this.#insertTag(this.#createTag("day"));
	}

	#insertTag(tag) {
		this.tagCloudContainer.appendChild(tag);
	}

	#createTag(name) {
		return new Control("span")
			.class("badge", "rounded-pill", "text-bg-secondary")
			.child(new Control("span")
				.class("tag-content")
				.text(name)
				.get()
			).child(new Control("a")
				.add("href", "#")
				.class("tag-dismiss")
				.child(new Control("i")
					.class("bi", "bi-x-lg")
					.get()
				).get()
			).get();
	}
}

export const tagging = new Tagging();