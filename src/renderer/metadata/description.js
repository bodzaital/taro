import { $, $$ } from '../shorthand';
import { sidebar } from '../sidebar';

class Description {
	element = $("#metadataDescription");

	constructor() {
		this.element.addEventListener("keyup", () => {
			sidebar.metadata.description = this.element.value;
			sidebar.writeMetadata();
		});
	}

	setDescriptionValue(value) {
		this.element.value = value;
	}

	isEditing() {
		return document.activeElement === this.element;
	}
}

export const description = new Description();