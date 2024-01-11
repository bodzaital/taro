import { $ } from "./shorthand";
import { thumbnail } from "./thumbnail";
import { windowFrame } from "./windowFrame";

class Folder {
	constructor() {
		this.isFolderLoaded = false;
	}

	loadFolder(imageUris) {
		// TODO: might delegate IPC communication here from renderer.

		thumbnail.loadFolder(imageUris);
		windowFrame.loadFolder("foldername bruh");

		this.isFolderLoaded = true;
	}

	unloadFolder() {
		thumbnail.unloadFolder();
		windowFrame.unloadFolder();
		
		this.isFolderLoaded = false;
	}
}

export const folder = new Folder();