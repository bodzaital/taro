class Folder {
	#folderLoadedEvent = new Event("folderLoaded");
	#folderUnloadedEvent = new Event("folderUnloaded");

	isFolderLoaded = null;
	folderInfo = null;
	
	constructor() {
		this.unloadFolder();
	}

	loadFolder(folderInfo) {
		// TODO: might delegate IPC communication here from renderer.
		this.unloadFolder();
		this.folderInfo = folderInfo;

		window.dispatchEvent(this.#folderLoadedEvent);

		this.isFolderLoaded = true;
	}

	unloadFolder() {
		window.dispatchEvent(this.#folderUnloadedEvent);
		
		this.isFolderLoaded = false;
		this.folderInfo = null;
	}
}

export const folder = new Folder();