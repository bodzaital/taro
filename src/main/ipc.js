import { Menu, ipcMain } from "electron";
import { IpcToMain, IpcToRenderer } from "../data/ipcConstants";
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
		ipcMain.handle(IpcToMain.SAVE__SETTINGS, (_, keyValues) => appSettings.updateAndApply(keyValues));
		ipcMain.handle(IpcToMain.GET__METADATA, (_, folder, photo) => io.getMetadataHandler(folder, photo));
		ipcMain.handle(IpcToMain.WRITE__METADATA, (_, folder, metadata) => io.writeMetadataHandler(folder, metadata));
		ipcMain.handle(IpcToMain.GET__EVERY_TAG, (_, folder) => io.getAllTagsHandler(folder));
		ipcMain.handle(IpcToMain.OPEN__SETTINGS_JSON, () => io.openSettingsJson());
		ipcMain.handle(IpcToMain.APPLY__SETTINGS, () => appSettings.apply());
		ipcMain.handle(IpcToMain.REPLY__CONFIRM_DIALOG, (_, reply) => this.#handleReplyConfirmDialog(reply));

		// TODO: ABSOLUTELY REFACTOR THIS. THIS IS UGLY AND BAD.
		ipcMain.handle(IpcToMain.TOGGLE__WELCOME_DARK_MODE, () => {
			const isDarkMode = Menu.getApplicationMenu().getMenuItemById("view/dark-mode").checked;

			appSettings.updateAndApply([{
				"key": AppSettingsConstant.DARK_MODE,
				"value": !isDarkMode
					? "dark"
					: "light"
			}]);
		});

		ipcMain.handle(IpcToMain.SELECT__FOLDER, () => {
			io.openFolderHandler();
		});
	}

	#handleReplyConfirmDialog(reply) {
		const question = reply.split(".")[0];
		const answer = reply.split(".")[1];

		if (question == "ejectFolder") {
			if (answer == "yes") io.ejectFolder();
		}
	}

	raise(channel, ...args) {
		this.#mainWindow.webContents.send(channel, args);
	}
}

export const ipc = new IPC();