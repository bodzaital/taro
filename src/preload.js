import { contextBridge, ipcRenderer } from "electron";
import { IpcToMain, IpcToRenderer } from "./ipcConstants";

// Main -> Renderer
contextBridge.exposeInMainWorld("listen", {
	openFolder: (callback) => ipcRenderer.on(IpcToRenderer.OPEN__FOLDER, (_, args) => callback(...args)),
	closeFolder: (callback) => ipcRenderer.on(IpcToRenderer.CLOSE__FOLDER, () => callback()),
	toggleDarkMode: (callback) => ipcRenderer.on(IpcToRenderer.TOGGLE__DARKMODE, (_, args) => callback(...args)),
	showAlert: (callback) => ipcRenderer.on(IpcToRenderer.SHOW__ALERT, (_, args) => callback(...args)),
	applySetting: (callback) => ipcRenderer.on(IpcToRenderer.APPLY__SETTING, (_, args) => callback(...args)),
});

// Renderer -> Main ( -> Renderer)
contextBridge.exposeInMainWorld("invoke", {
	selectFolder: () => ipcRenderer.invoke(IpcToMain.SELECT__FOLDER),
	selectWelcomeFolder: () => ipcRenderer.invoke(IpcToMain.SELECT__WELCOME_FOLDER),
	toggleWelcomeDarkMode: () => ipcRenderer.invoke(IpcToMain.TOGGLE__WELCOME_DARK_MODE),
	saveSetting: (key, value) => ipcRenderer.invoke(IpcToMain.SAVE__SETTING, key, value),
	getExif: (uri) => ipcRenderer.invoke(IpcToMain.GET__EXIF, uri),
	getMetadata: (folder, photo) => ipcRenderer.invoke(IpcToMain.GET__METADATA, folder, photo),
	writeMetadata: (folder, metadata) => ipcRenderer.invoke(IpcToMain.WRITE__METADATA, folder, metadata),
	getEveryTag: (folder) => ipcRenderer.invoke(IpcToMain.GET__EVERY_TAG, folder),
});