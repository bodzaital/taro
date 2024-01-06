import { ipcMain } from "electron";
import { CH_OPEN_FOLDER } from "../ipcConstants";
import { openFolderHandler } from "./io";

let _mainWindow = null;

export function initializeIpc(mainWindow) {
	_mainWindow = mainWindow;
}

export function registerIpcMainHandlers() {
	ipcMain.handle(CH_OPEN_FOLDER, () => openFolderHandler());
}

export function raiseEvent(channelName, argsArray = null) {
	if (_mainWindow == null) throw new Error("initializeIpc was not called with an instance of mainWindow.");

	_mainWindow.webContents.send(channelName, argsArray);
}