import { $ } from "./shorthand";
import { sidebar } from "./sidebar";
import { thumbnail } from "./thumbnail";
import { windowFrame } from "./windowFrame";

class Folder {
	#folderLoadedEvent = new Event("folderLoaded");
	#folderUnloadedEvent = new Event("folderUnloaded");

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

		// thumbnail.loadFolder(folderInfo.imageURIs);
		// windowFrame.loadFolder(folderInfo.folderName);
		// sidebar.loadFolder();

		window.dispatchEvent(this.#folderLoadedEvent);

		this.isFolderLoaded = true;
	}

	unloadFolder() {
		if (this.isFolderLoaded === false) return;

		// thumbnail.unloadFolder();
		// windowFrame.unloadFolder();
		// sidebar.unloadFolder();

		window.dispatchEvent(this.#folderUnloadedEvent);
		
		this.isFolderLoaded = false;
		this.folderInfo = null;
	}
}

export const folder = new Folder();