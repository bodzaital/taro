import Control from "../control";
import { $ } from "../shorthand";
import { sidebar } from "../sidebar";

class Tagging {
	tagCloudContainer = $(".tag-cloud-container");
	tagSuggestionContainer = $(".tag-suggestion-container");
	tagInput = $("#tagInput");

	constructor() {
		this.tagCloudContainer.addEventListener("click", (e) => {
			const nearestDismiss = e.target.closest(".tag-dismiss");
			if (nearestDismiss == null) return;

			const nearestBadge = e.target.closest(".badge");
			if (nearestBadge == null) return;

			const tagName = $(".tag-content", nearestBadge).innerText;

			this.deleteTag(tagName);
		});

		window.addEventListener("folderUnloaded", () => {
			this.tagInput.disabled = true;
			this.clearTags();
		});
		
		window.addEventListener("folderLoaded", () => {
			this.tagInput.disabled = false;
		});

		this.tagInput.addEventListener("keyup", (e) => {
			if (e.key != "Enter") return;
			const newTag = this.tagInput.value;
			if (sidebar.metadata.tags.includes(newTag)) return;

			this.addTag(this.tagInput.value);
			this.tagInput.value = "";
		});
	}

	isInputActive() {
		return document.activeElement == this.tagInput;
	}

	deleteTag(tagName) {
		sidebar.metadata.tags = sidebar.metadata.tags.filter((x) => x != tagName);

		this.createTags(...sidebar.metadata.tags);
		sidebar.writeMetadata();
	}
	
	addTag(tagName) {
		sidebar.metadata.tags.push(tagName);

		this.createTags(...sidebar.metadata.tags);
		sidebar.writeMetadata();
	}

	createTags(...tags) {
		this.clearTags();
		tags.forEach((tag) => this.#insertTag(this.#createTag(tag)));
	}
	
	clearTags() {
		this.tagCloudContainer.innerText = "";
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