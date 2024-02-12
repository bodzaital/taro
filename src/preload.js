import { contextBridge, ipcRenderer } from "electron";
import { CH_APPLY_SETTING, CH_CLOSE_FOLDER, CH_GET_ALL_TAGS_IN_FOLDER, CH_GET_EXIF, CH_GET_METADATA, CH_LOAD_IMAGES, CH_SAVE_SETTING, CH_SHOW_ALERT, CH_TOGGLE_DARK_MODE, CH_WELCOME_OPEN_FOLDER, CH_WELCOME_SCREEN_TOGGLE_DARK_MODE, CH_WRITE_METADATA, IpcConstants } from "./ipcConstants";

contextBridge.exposeInMainWorld("ipc", {
	// Main -> Renderer communication
	loadImages: (callback) => ipcRenderer.on(CH_LOAD_IMAGES, (_, args) => callback(...args)),
	closeFolder: (callback) => ipcRenderer.on(CH_CLOSE_FOLDER, () => callback()),
	toggleDarkMode: (callback) => ipcRenderer.on(CH_TOGGLE_DARK_MODE, (_, args) => callback(...args)),
	showAlert: (callback) => ipcRenderer.on(CH_SHOW_ALERT, (_, args) => callback(...args)),
	applySetting: (callback) => ipcRenderer.on(CH_APPLY_SETTING, (_, args) => callback(...args)),

	// Renderer <-> Main communication
	welcomeOpenFolder: () => ipcRenderer.invoke(CH_WELCOME_OPEN_FOLDER),
	welcomeToggleDarkMode: () => ipcRenderer.invoke(CH_WELCOME_SCREEN_TOGGLE_DARK_MODE),
	saveSetting: (key, value) => ipcRenderer.invoke(CH_SAVE_SETTING, key, value),
	getExif: (uri) => ipcRenderer.invoke(CH_GET_EXIF, uri),
	getMetadata: (folder, photo) => ipcRenderer.invoke(CH_GET_METADATA, folder, photo),
	writeMetadata: (folder, metadata) => ipcRenderer.invoke(CH_WRITE_METADATA, folder, metadata),
	getAllTags: (folder) => ipcRenderer.invoke(CH_GET_ALL_TAGS_IN_FOLDER, folder),
});

// TODO: refactor with sensible names for the channels...

// Main -> Renderer
contextBridge.exposeInMainWorld("listen", {
	openFolder: (callback) => ipcRenderer.on(IpcConstants.OPEN_FOLDER, (_, args) => callback(...args)),
});

// Renderer -> Main ( -> Renderer)
contextBridge.exposeInMainWorld("invoke", {
	openFolder: () => ipcRenderer.invoke(IpcConstants.SELECT_FOLDER),
});