import { ipcMain } from "electron";
import { CH_GET_EXIF, CH_GET_METADATA, CH_OPEN_FOLDER, CH_SAVE_SETTING } from "../ipcConstants";
import { io } from "./io";
import { appSettings } from "./appsettings";

class IPC {
	#mainWindow = null;

	init(mainWindow) {
		this.#mainWindow = mainWindow;
	}

	register() {
		// ipcMain.handle(CH_OPEN_FOLDER, () => openFolderHandler());

		ipcMain.handle(CH_GET_EXIF, (a, b) => io.exifHandler(b));

		ipcMain.handle(CH_SAVE_SETTING, (_, key, value) => appSettings.updateAndApply([{
			"key": key,
			"value": value
		}]));
	}

	raise(channel, args = null) {
		this.#mainWindow.webContents.send(channel, args);
	}
}

export const ipc = new IPC();