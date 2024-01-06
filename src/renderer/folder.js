import { clearPhoto, clearThumbnails, createThumbnails, selectThumbnail, showSelectedThumbnail, thumbnail } from "./thumbnail";
import { windowFrame } from "./windowFrame";

class Folder {
	constructor() {
		this.isFolderLoaded = false;
	}

	loadFolder(imageUris) {
		// TODO: might delegate IPC communication here from renderer.

		thumbnail.createThumbnails(imageUris);
		thumbnail.selectThumbnail(0);
		thumbnail.showSelectedThumbnail();

		windowFrame.loadFolder("foldername bruh");

		this.isFolderLoaded = true;
	}

	unloadFolder() {
		thumbnail.clearThumbnails();
		thumbnail.clearPhoto();
		
		this.isFolderLoaded = false;
	}
}

export const folder = new Folder();