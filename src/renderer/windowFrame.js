import { $ } from "./shorthand";

// TODO: handle dark mode here

class WindowFrame {
	constructor() {
		this._searchbar = $("#titleBarSearch");
		this._searchbar.placeholder = "No folder opened";
		this._searchbar.enabled = false;
	}
	
	loadFolder(value) {
		this._searchbar.placeholder = value;
		this._searchbar.enabled = true;
	}
	
	unloadFolder() {
		this._searchbar.placeholder = "No folder opened";
		this._searchbar.enabled = false;
	}
}

export const windowFrame = new WindowFrame();