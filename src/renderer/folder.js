import { createThumbnails, selectThumbnail, showSelectedThumbnail } from "./thumbnail";

class Folder {
	constructor() {
		this.isFolderLoaded = false;
	}

	loadFolder(imageUris) {
		// TODO: might delegate IPC communication here from renderer.

		createThumbnails(imageUris);
		selectThumbnail(0);
		showSelectedThumbnail();

		this.isFolderLoaded = true;
	}

	unloadFolder() {
		this.isFolderLoaded = false;
	}
}

export const folder = new Folder();