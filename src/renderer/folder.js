import { $ } from "./shorthand";
import { sidebar } from "./sidebar";
import { thumbnail } from "./thumbnail";
import { windowFrame } from "./windowFrame";

class Folder {
	isFolderLoaded = null;
	folderInfo = null;
	
	constructor() {
		// this.isFolderLoaded = false;
		this.unloadFolder();
	}

	loadFolder(folderInfo) {
		// TODO: might delegate IPC communication here from renderer.
		this.unloadFolder();
		this.folderInfo = folderInfo;

		thumbnail.loadFolder(folderInfo.imageURIs);
		windowFrame.loadFolder(folderInfo.folderName);
		sidebar.loadFolder();

		this.isFolderLoaded = true;
	}

	unloadFolder() {
		if (this.isFolderLoaded === false) return;

		thumbnail.unloadFolder();
		windowFrame.unloadFolder();
		sidebar.unloadFolder();
		
		this.isFolderLoaded = false;
		this.folderInfo = null;
	}
}

export const folder = new Folder();