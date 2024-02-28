import { AppSettingsConstant } from '../data/appsettingsConstants';
import { folder } from './folder';
import { description } from './metadata/description';
import { location } from './metadata/location';
import { rating } from './metadata/rating';
import { tagging } from './metadata/tagging';
import { exif } from "./metadata/exif";
import { $ } from './utility/shorthand';

class Sidebar {
	#sidebarToggleButton = $("#sidebarToggleButton");
	#viewer = $(".viewer");
	#isSidebarOpen = true;
	#photoName = {
		noPhoto: $("#noPhoto"),
		value: $("#photoName")
	};

	constructor() {
		this.#sidebarToggleButton.addEventListener("click", () => {
			window.invoke.saveSetting("isSidebarVisible", !this.#isSidebarOpen);
		});

		window.addEventListener("folderLoaded", () => this.#loadFolder());
		window.addEventListener("folderUnloaded", () => this.#unloadFolder());

		window.listen.applySetting((key, value) => this.#applySetting(key, value));
	}

	#toggleSidebar(state) {
		this.#isSidebarOpen = state;

		if (this.#isSidebarOpen) {
			this.#viewer.classList.remove("no-sidebar");
			this.#sidebarToggleButton.classList.add("active");
		} else {
			this.#viewer.classList.add("no-sidebar");
			this.#sidebarToggleButton.classList.remove("active");
		}
	}

	#changePosition(value) {
		if (value == "left") {
			this.#viewer.classList.add("left-sidebar");
		} else {
			this.#viewer.classList.remove("left-sidebar");
		}
	}

	setPhotoName(photoName) {
		this.#photoName.value.innerText = photoName;
	}

	#loadFolder() {
		this.#photoName.value.classList.remove("d-none");
		this.#photoName.noPhoto.classList.add("d-none");
	}

	#unloadFolder() {
		this.#photoName.value.classList.add("d-none");
		this.#photoName.noPhoto.classList.remove("d-none");
	}

	#applySetting(key, value) {
		if (key == AppSettingsConstant.SIDEBAR_VISIBLE) this.#toggleSidebar(value);
		if (key == AppSettingsConstant.SIDEBAR_POSITION) this.#changePosition(value);
	}
}

export const sidebar = new Sidebar();