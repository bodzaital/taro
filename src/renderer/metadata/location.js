import { $ } from "../shorthand";
import { sidebar } from "../sidebar";

class Location {
	#input = $("#locationInput");

	constructor() {
		this.#input.addEventListener("keyup", () => {
			sidebar.metadata.location = this.#input.value.trim();
			sidebar.writeMetadata();
		});

		window.addEventListener("folderLoaded", () => {
			this.loadFolder();
		});

		window.addEventListener("folderUnloaded", () => {
			this.unloadFolder();
		});

		this.#input.addEventListener("keydown", (e) => {
			if (!this.#hasPressedCtrlOrCmdA(e)) return;

			this.#input.select();
		});
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
	}

	unloadFolder() {
		this.#input.disabled = true;
		this.#input.value = "";
	}
}

export const location = new Location();