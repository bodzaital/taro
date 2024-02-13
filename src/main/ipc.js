import { Menu, ipcMain } from "electron";
import { IpcToMain, IpcToRenderer } from "../ipcConstants";
import { io } from "./io";
import { appSettings } from "./appsettings";
import { AppSettingsConstant } from "../data/appsettingsConstants";

class IPC {
	#mainWindow = null;

	init(mainWindow) {
		this.#mainWindow = mainWindow;
	}

	register() {
		ipcMain.handle(IpcToMain.GET__EXIF, (_, b) => io.exifHandler(b));

		ipcMain.handle(IpcToMain.SAVE__SETTING, (_, key, value) => appSettings.updateAndApply([{
			"key": key,
			"value": value
		}]));

		ipcMain.handle(IpcToMain.GET__METADATA, (_, folder, photo) => io.getMetadataHandler(folder, photo));
		ipcMain.handle(IpcToMain.WRITE__METADATA, (_, folder, metadata) => io.writeMetadataHandler(folder, metadata));
		ipcMain.handle(IpcToMain.GET__EVERY_TAG, (_, folder) => io.getAllTagsHandler(folder));

		// ABSOLUTELY REFACTOR THIS. THIS IS UGLY AND BAD.
		ipcMain.handle(IpcToMain.TOGGLE__WELCOME_DARK_MODE, () => {
			const isDarkMode = Menu.getApplicationMenu().getMenuItemById("view/dark-mode").checked;

			appSettings.updateAndApply([{
				"key": AppSettingsConstant.DARK_MODE,
				"value": !isDarkMode
			}]);
		});

		ipcMain.handle(IpcToMain.SELECT__FOLDER, () => {
			io.openFolderHandler();
		});
	}

	raise(channel, args = null) {
		this.#mainWindow.webContents.send(channel, args);
	}
}

export const ipc = new IPC();