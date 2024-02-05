import Control from "../control";
import { notifications } from "../inAppNotifications";
import { $ } from "../shorthand";
import { sidebar } from "../sidebar";

class Tagging {
	#cloud = $(".tag-cloud-container");
	#input = $("#tagInput");

	constructor() {
		window.addEventListener("folderUnloaded", () => {
			this.#folderUnloaded();
		});
		
		window.addEventListener("folderLoaded", () => {
			this.#folderLoaded();
		});

		this.#cloud.addEventListener("click", (e) => {
			const tagDismiss = e.target.closest(".tag-dismiss");
			if (tagDismiss == null) return;

			const badge = e.target.closest(".badge");
			const tagNameToRemove = badge.dataset.tag;

			this.#removeTag(tagNameToRemove);
		});

		this.#input.addEventListener("keyup", (e) => {
			if (e.key == "Enter") this.#tryAddTag(this.#input.value.trim());
		});

		this.#input.addEventListener("keydown", (e) => {
			if (!this.#hasPressedCtrlOrCmdA(e)) return;

			this.#input.select();
		});
	}

	#hasPressedCtrlOrCmdA(e) {
		return e.key == "a" && (e.ctrlKey || e.metaKey);
	}

	isInputActive() {
		return document.activeElement == this.#input;
	}

	createTags(...names) {
		this.#cloud.innerText = "";
		this.#input.value = "";
		names.forEach((name) => this.#insertElement(name));
	}

	#tryAddTag(name) {
		if (!this.#canAddTag(name)) {
			notifications.create(`Cannot tag this photo with ${name}`, "danger");
			return;
		}

		this.#addTag(name);
		this.#input.value = "";
	}

	#canAddTag(name) {
		const doesInclude = sidebar.metadata.tags.includes(name);
		const isEmpty = name.length == 0;

		return !doesInclude && !isEmpty;
	}

	#insertElement(name) {
		this.#cloud.appendChild(this.#createElement(name));
	}

	#addTag(name) {
		this.#insertElement(name);
		sidebar.metadata.tags.push(name);
		sidebar.writeMetadata();
	}

	#removeTag(name) {
		$(`[data-tag='${name}']`, this.#cloud).remove();
		sidebar.metadata.tags = sidebar.metadata.tags.filter((tag) => tag != name);
		sidebar.writeMetadata();
	}

	#folderLoaded() {
		this.#input.disabled = false;
	}

	#folderUnloaded() {
		this.#input.disabled = true;
		this.#cloud.innerText = "";
	}

	#createElement(name) {
		return new Control("span")
			.class("badge", "rounded-pill", "text-bg-secondary")
			.data("tag", name)
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