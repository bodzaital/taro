import { ipcMain } from "electron";
import { CH_GET_EXIF, CH_GET_METADATA, CH_SAVE_SETTING, CH_WRITE_METADATA } from "../ipcConstants";
import { io } from "./io";
import { appSettings } from "./appsettings";

class IPC {
	#mainWindow = null;

	init(mainWindow) {
		this.#mainWindow = mainWindow;
	}

	register() {
		ipcMain.handle(CH_GET_EXIF, (_, b) => io.exifHandler(b));

		ipcMain.handle(CH_SAVE_SETTING, (_, key, value) => appSettings.updateAndApply([{
			"key": key,
			"value": value
		}]));

		ipcMain.handle(CH_GET_METADATA, (_, folder, photo) => io.getMetadataHandler(folder, photo));
		ipcMain.handle(CH_WRITE_METADATA, (_, folder, metadata) => io.writeMetadataHandler(folder, metadata));
	}

	raise(channel, args = null) {
		this.#mainWindow.webContents.send(channel, args);
	}
}

export const ipc = new IPC();