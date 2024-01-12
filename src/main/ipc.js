import { ipcMain } from "electron";
import { CH_GET_METADATA, CH_OPEN_FOLDER } from "../ipcConstants";
import { io } from "./io";

class IPC {
	#mainWindow = null;

	init(mainWindow) {
		this.#mainWindow = mainWindow;
	}

	register() {
		// ipcMain.handle(CH_OPEN_FOLDER, () => openFolderHandler());
	}

	raise(channel, args = null) {
		this.#mainWindow.webContents.send(channel, args);
	}
}

export const ipc = new IPC();