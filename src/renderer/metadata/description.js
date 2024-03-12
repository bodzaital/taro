import { i18n } from '../i18n';
import { $, $$ } from '../utility/shorthand';
import { metadata } from './metadata';

class Description {
	#element = $("#metadataDescription");

	constructor() {
		this.#element.addEventListener("keyup", () => {
			metadata.setDescription(this.#element.value.trim());
		});

		this.#element.addEventListener("keydown", (e) => {
			if (!this.#hasPressedCtrlOrCmdA(e)) return;

			this.#element.select();
		});

		window.addEventListener("folderLoaded", () => this.loadFolder());
		window.addEventListener("folderUnloaded", () => this.unloadFolder());
	}

	#hasPressedCtrlOrCmdA(e) {
		return (e.ctrlKey || e.metaKey) && e.key == "a";
	}

	setDescriptionValue(value) {
		this.#element.value = value;
	}

	isEditing() {
		return document.activeElement === this.#element;
	}

	loadFolder() {
		this.#element.disabled = false;
		i18n.push("sidebar.description.placeholder", "Add description", (text) => {
			this.#element.placeholder = text;
		});
	}
	
	unloadFolder() {
		this.#element.disabled = true;
		this.#element.value = "";
		this.#element.placeholder = "";
	}
}

export const description = new Description();