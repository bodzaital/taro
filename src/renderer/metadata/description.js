import { folder } from '../folder';
import { $, $$ } from '../shorthand';
import { sidebar } from '../sidebar';

class Description {
	element = $("#metadataDescription");

	constructor() {
		this.element.addEventListener("keyup", () => {
			sidebar.metadata.description = this.element.value;
			sidebar.writeMetadata();
		});

		window.addEventListener("folderLoaded", () => {
			this.loadFolder();
		});

		window.addEventListener("folderUnloaded", () => {
			this.unloadFolder();
		});
	}

	setDescriptionValue(value) {
		this.element.value = value;
	}

	isEditing() {
		return document.activeElement === this.element;
	}

	loadFolder() {
		this.element.disabled = false;
	}
	
	unloadFolder() {
		this.element.disabled = true;
		this.element.value = "";
	}
}

export const description = new Description();