import { clearPhoto, clearThumbnails, createThumbnails, selectThumbnail, showSelectedThumbnail } from "./thumbnail";
import { windowFrame } from "./windowFrame";

class Folder {
	constructor() {
		this.isFolderLoaded = false;
	}

	loadFolder(imageUris) {
		// TODO: might delegate IPC communication here from renderer.

		createThumbnails(imageUris);
		selectThumbnail(0);
		showSelectedThumbnail();

		windowFrame.loadFolder("foldername bruh");

		this.isFolderLoaded = true;
	}

	unloadFolder() {
		clearThumbnails();
		clearPhoto();
		
		this.isFolderLoaded = false;
	}
}

export const folder = new Folder();