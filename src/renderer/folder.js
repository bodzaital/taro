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

		window.dispatchEvent(this.#folderLoadedEvent);

		this.isFolderLoaded = true;
	}

	unloadFolder() {
		window.dispatchEvent(this.#folderUnloadedEvent);
		
		this.isFolderLoaded = false;
		this.folderPath = null;
		this.baseName = null;
		this.listOfImageURIs = null;
	}
}

export const folder = new Folder();