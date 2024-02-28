class Folder {
	#folderLoadedEvent = new Event("folderLoaded");
	#folderUnloadedEvent = new Event("folderUnloaded");

	isFolderLoaded = null;
	folderPath = null;
	baseName = null;
	listOfImageURIs = null;
	
	constructor() {
		this.unloadFolder();
	}

	loadFolder(folderPath, baseName, listOfImageURIs) {
		// TODO: might delegate IPC communication here from renderer.
		this.unloadFolder();
		
		this.folderPath = folderPath;
		this.baseName = baseName;
		this.listOfImageURIs = listOfImageURIs;

		this.isFolderLoaded = true;
		window.dispatchEvent(this.#folderLoadedEvent);
	}

	unloadFolder() {
		this.folderPath = null;
		this.baseName = null;
		this.listOfImageURIs = null;

		this.isFolderLoaded = false;
		window.dispatchEvent(this.#folderUnloadedEvent);
	}
}

export const folder = new Folder();