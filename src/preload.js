import { contextBridge, ipcRenderer } from "electron";
import { CH_CLOSE_FOLDER, CH_LOAD_IMAGES, CH_OPEN_FOLDER } from "./ipcConstants";

contextBridge.exposeInMainWorld("ipc", {
	loadImages: (callback) => ipcRenderer.on(CH_LOAD_IMAGES, (_, args) => callback(...args)),
	openFolder: () => ipcRenderer.invoke(CH_OPEN_FOLDER),
	closeFolder: (callback) => ipcRenderer.on(CH_CLOSE_FOLDER, () => callback())
});