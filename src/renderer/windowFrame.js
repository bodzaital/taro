import { AppSettingsConstant } from "../data/appsettingsConstants";
import { folder } from "./folder";
import { $, $$ } from "./utility/shorthand";
import { photoNavigation } from "./photoNavigation";

class WindowFrame {
	#searchbar = $("#titleBarHeader");
	#folderName = null;
	content = $(".content");

	#welcomeScreen = {
		container: $(".startup"),
		openFolderButton: $("#startupOpenFolder"),
		darkModeButton: $("#startupDarkMode"),
		getHelpButton: $("#startupGetHelp"),
	}

	isSearchActive = false;

	constructor() {
		this.#searchbar.addEventListener("focusin", () => {
			this.#searchbar.classList.add("is-search");
			this.#searchbar.classList.remove("is-header");
			this.#searchbar.placeholder = "Search for photo..."
			this.isSearchActive = true;
		});
		
		this.#searchbar.addEventListener("focusout", () => {
			this.#searchbar.classList.remove("is-search");
			this.#searchbar.classList.add("is-header");
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

			photoNavigation.selectPhoto(firstFoundIndex);
		});

		window.addEventListener("folderLoaded", () => {
			this.loadFolder(folder.baseName);
		});

		window.addEventListener("folderUnloaded", () => {
			this.unloadFolder();
		});

		window.listen.applySetting((key, value) => {
			if (key == AppSettingsConstant.DARK_MODE) this.setDarkMode(value);
		});
		
		this.#welcomeScreen.darkModeButton.addEventListener("click", () => {
			window.invoke.toggleWelcomeDarkMode();
		});

		this.#welcomeScreen.openFolderButton.addEventListener("click", () => {
			window.invoke.selectFolder();
		});
	}
	
	loadFolder(value) {
		this.#folderName = value;

		this.#searchbar.placeholder = this.#folderName;
		this.#searchbar.disabled = false;

		this.#welcomeScreen.container.classList.add("d-none");
	}
	
	unloadFolder() {
		this.#folderName = null

		this.#searchbar.placeholder = "taro";
		this.#searchbar.disabled = true;

		this.#welcomeScreen.container.classList.remove("d-none");
	}

	setDarkMode(value) {
		$("html").dataset.bsTheme = value;
	}
}

export const windowFrame = new WindowFrame();