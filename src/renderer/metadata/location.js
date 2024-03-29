import { i18n } from "../i18n";
import { $ } from "../utility/shorthand";
import { metadata } from "./metadata";

class Location {
	#input = $("#locationInput");

	constructor() {
		this.#input.addEventListener("keyup", () => {
			metadata.setLocation(this.#input.value.trim());
		});

		this.#input.addEventListener("keydown", (e) => {
			if (!this.#hasPressedCtrlOrCmdA(e)) return;

			this.#input.select();
		});

		window.addEventListener("folderLoaded", () => this.loadFolder());
		window.addEventListener("folderUnloaded", () => this.unloadFolder());
	}

	#hasPressedCtrlOrCmdA(e) {
		return e.key == "a" && (e.ctrlKey || e.metaKey);
	}

	setLocationValue(value) {
		this.#input.value = value;
	}

	isEditing() {
		return document.activeElement === this.#input;
	}

	loadFolder() {
		this.#input.disabled = false;

		i18n.push("sidebar.location.placeholder", "Add tag", (text) => {
			this.#input.placeholder = text;
		});
	}

	unloadFolder() {
		this.#input.disabled = true;
		this.#input.value = "";
		this.#input.placeholder = "";
	}
}

export const location = new Location();