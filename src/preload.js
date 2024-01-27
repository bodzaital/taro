import { contextBridge, ipcRenderer } from "electron";
import { CH_APPLY_SETTING, CH_CLOSE_FOLDER, CH_GET_EXIF, CH_LOAD_IMAGES, CH_NO_IMAGES, CH_OPEN_CANCELED, CH_OPEN_FOLDER, CH_SAVE_SETTING, CH_SHOW_ALERT, CH_TOGGLE_DARK_MODE } from "./ipcConstants";

contextBridge.exposeInMainWorld("ipc", {
	loadImages: (callback) => ipcRenderer.on(CH_LOAD_IMAGES, (_, args) => callback(...args)),
	openFolder: () => ipcRenderer.invoke(CH_OPEN_FOLDER),
	closeFolder: (callback) => ipcRenderer.on(CH_CLOSE_FOLDER, () => callback()),
	toggleDarkMode: (callback) => ipcRenderer.on(CH_TOGGLE_DARK_MODE, (_, args) => callback(...args)),

	saveSetting: (key, value) => ipcRenderer.invoke(CH_SAVE_SETTING, key, value),
	
	// Main -> Renderer communication
	showAlert: (callback) => ipcRenderer.on(CH_SHOW_ALERT, (_, args) => callback(...args)),
	applySetting: (callback) => ipcRenderer.on(CH_APPLY_SETTING, (_, args) => callback(...args)),

	getExif: (uri) => ipcRenderer.invoke(CH_GET_EXIF, uri),
});