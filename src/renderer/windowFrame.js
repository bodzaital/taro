import Control from "./control";
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

			if (firstFoundIndex < 0) return;

			thumbnail.selectPhoto(firstFoundIndex);
		});
	}
	
	loadFolder(value) {
		this.#folderName = value;

		thumbnail.activePhoto.innerText = "";

		this.#searchbar.placeholder = this.#folderName;
		this.#searchbar.disabled = false;
	}
	
	unloadFolder() {
		this.#folderName = null

		thumbnail.activePhoto.appendChild(new Control("div")
			.class("startup")
				.child(new Control("h1")
					.class("branding")
					.text("taro")
					.get()
				).child(new Control("div")
					.class("sub-branding")
					.text("Photography culling and tagging")
					.get()
				).child(new Control("div")
					.class("btn-group")
					.child(new Control("button")
						.add("id", "startupOpenFolder")
						.class("btn", "btn-sm", "btn-success")
						.text("Open folder")
						.get()
					).child(new Control("button")
						.add("id", "startupDarkMode")
						.class("btn", "btn-sm", "btn-outline-secondary")
						.text("Dark mode")
						.get()
					).child(new Control("button")
						.add("id", "startupGetHelp")
						.class("btn", "btn-sm", "btn-outline-secondary")
						.text("Get help")
						.get()
					)
					.get()
				)
			.get()
		);

		this.#searchbar.placeholder = "taro";
		this.#searchbar.disabled = true;
	}
}

export const windowFrame = new WindowFrame();