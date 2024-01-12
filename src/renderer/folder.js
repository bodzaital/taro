import { $ } from "./shorthand";
import { thumbnail } from "./thumbnail";
import { windowFrame } from "./windowFrame";

class Folder {
	constructor() {
		this.isFolderLoaded = false;
	}

	loadFolder(folderInfo) {
		// TODO: might delegate IPC communication here from renderer.

		thumbnail.loadFolder(folderInfo.imageURIs);
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