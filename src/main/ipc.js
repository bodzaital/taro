import { Menu, ipcMain } from "electron";
import { CH_GET_ALL_TAGS_IN_FOLDER, CH_GET_EXIF, CH_GET_METADATA, CH_SAVE_SETTING, CH_WELCOME_OPEN_FOLDER, CH_WELCOME_SCREEN_TOGGLE_DARK_MODE, CH_WRITE_METADATA } from "../ipcConstants";
import { io } from "./io";
import { appSettings } from "./appsettings";
import { system } from "./system";
import { AppSettingsConstant } from "../data/appsettingsConstants";

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
		ipcMain.handle(CH_GET_ALL_TAGS_IN_FOLDER, (_, folder) => io.getAllTagsHandler(folder));

		// ABSOLUTELY REFACTOR THIS. THIS IS UGLY AND BAD.
		ipcMain.handle(CH_WELCOME_SCREEN_TOGGLE_DARK_MODE, () => {
			const isDarkMode = Menu.getApplicationMenu().getMenuItemById("view/dark-mode").checked;

			appSettings.updateAndApply([{
				"key": AppSettingsConstant.DARK_MODE,
				"value": !isDarkMode
			}]);
		});

		ipcMain.handle(CH_WELCOME_OPEN_FOLDER, () => {
			io.openFolderHandler();
		});
	}

	raise(channel, args = null) {
		this.#mainWindow.webContents.send(channel, args);
	}
}

export const ipc = new IPC();