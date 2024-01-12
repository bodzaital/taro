import { contextBridge, ipcRenderer } from "electron";
import { CH_CLOSE_FOLDER, CH_LOAD_IMAGES, CH_NO_IMAGES, CH_OPEN_FOLDER, CH_TOGGLE_DARK_MODE } from "./ipcConstants";

contextBridge.exposeInMainWorld("ipc", {
	loadImages: (callback) => ipcRenderer.on(CH_LOAD_IMAGES, (_, args) => callback(...args)),
	openFolder: () => ipcRenderer.invoke(CH_OPEN_FOLDER),
	closeFolder: (callback) => ipcRenderer.on(CH_CLOSE_FOLDER, () => callback()),
	toggleDarkMode: (callback) => ipcRenderer.on(CH_TOGGLE_DARK_MODE, (_, args) => callback(...args)),
	noImages: (callback) => ipcRenderer.on(CH_NO_IMAGES, () => callback()),
});