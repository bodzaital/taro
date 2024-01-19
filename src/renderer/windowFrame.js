import { $, $$ } from "./shorthand";
import { thumbnail } from "./thumbnail";

// TODO: handle dark mode here

class WindowFrame {
	#searchbar = $("#titleBarSearch");
	#folderName = null;

	isSearchActive = false;

	constructor() {
		this.#searchbar.addEventListener("focusin", () => {
			this.#searchbar.classList.add("is-search-field");
			this.#searchbar.placeholder = "Search for photo..."
			this.isSearchActive = true;
		});
		
		this.#searchbar.addEventListener("focusout", () => {
			this.#searchbar.classList.remove("is-search-field");
			this.#searchbar.placeholder = this.#folderName;
			this.#searchbar.value = "";
			this.isSearchActive = false;
		});

		this.#searchbar.addEventListener("input", () => {
			const searchTerm = this.#searchbar.value;

			const firstFoundThumbnail = Array.from($$(".thumbnail"))
				.filter((thumbnail) => thumbnail.dataset.name.includes(searchTerm))[0];
				
			const firstFoundIndex = Array.from($$(".thumbnail")).indexOf(firstFoundThumbnail);

			console.log(`Searching for : ${searchTerm} at index: ${firstFoundIndex}`);

			if (firstFoundIndex < 0) return;

			thumbnail.selectPhoto(firstFoundIndex);
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