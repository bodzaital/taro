import { $ } from "./shorthand";

// TODO: handle dark mode here

class WindowFrame {
	#searchbar = $("#titleBarSearch");
	#folderName = null;

	constructor() {
		this.#searchbar.addEventListener("focusin", () => {
			this.#searchbar.classList.add("is-search-field");
			this.#searchbar.placeholder = "Search for photo..."
		});
		
		this.#searchbar.addEventListener("focusout", () => {
			this.#searchbar.classList.remove("is-search-field");
			this.#searchbar.placeholder = this.#folderName;
			this.#searchbar.value = "";
		});
	}
	
	loadFolder(value) {
		this.#folderName = value;

		this.#searchbar.placeholder = this.#folderName;
		this.#searchbar.disabled = false;
	}
	
	unloadFolder() {
		this.#folderName = null

		this.#searchbar.placeholder = "taro";
		this.#searchbar.disabled = true;
	}
}

export const windowFrame = new WindowFrame();