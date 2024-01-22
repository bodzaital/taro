import { $ } from "./shorthand";
import { sidebar } from "./sidebar";
import { thumbnail } from "./thumbnail";
import { windowFrame } from "./windowFrame";

class Folder {
	isFolderLoaded = false;
	
	constructor() {
		// this.isFolderLoaded = false;
		this.unloadFolder();
	}

	loadFolder(folderInfo) {
		// TODO: might delegate IPC communication here from renderer.

		this.unloadFolder();

		thumbnail.loadFolder(folderInfo.imageURIs);
		windowFrame.loadFolder(folderInfo.folderName);
		sidebar.loadFolder();

		this.isFolderLoaded = true;
	}

	unloadFolder() {
		thumbnail.unloadFolder();
		windowFrame.unloadFolder();
		sidebar.unloadFolder();
		
		this.isFolderLoaded = false;
	}
}

export const folder = new Folder();