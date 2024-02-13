import { Menu, app } from "electron";
import path from "path";
import fs from "fs";
import { ipc } from "./ipc";
import { CH_APPLY_SETTING, IpcToRenderer } from "../ipcConstants";
import { AppSettingsConstant } from "../data/appsettingsConstants";

export class AppSettings {
	#appSettings = null;

	apply() {
		this.#open();
		this.#apply();
	}

	updateAndApply(keyValuePairs) {
		this.#open();
		this.#update(keyValuePairs);
		this.#apply();
		this.#write();
	}

	#open() {
		const settingsFileUri = path.join(app.getPath("userData"), "settings.json");

		if (!fs.existsSync(settingsFileUri)) fs.writeFileSync(settingsFileUri, {});
		const settings = JSON.parse(fs.readFileSync(settingsFileUri));

		this.#appSettings = settings;
	}

	#update(keyValuePairs) {
		if (this.#appSettings == null) throw new Error("AppSettings is not loaded.");

		keyValuePairs.forEach((keyValuePair) => {
			this.#appSettings[keyValuePair.key] = keyValuePair.value;
		});
	}

	#apply() {
		if (this.#appSettings == null) throw new Error("AppSettings is not loaded.");

		this.#applyDarkMode();
		this.#applyIsThumbnailsVisible();
		this.#applyIsSidebarVisible();
		this.#applySidebarPosition();
	}

	#write() {
		if (this.#appSettings == null) throw new Error("AppSettings is not loaded.");

		const settingsFileUri = path.join(app.getPath("userData"), "settings.json");
		const contents = JSON.stringify(this.#appSettings);
		
		fs.writeFileSync(settingsFileUri, contents);
		
		this.#appSettings = null;
	}

	// TODO: allow to follow system color mode. Also: set the appropriate system setting to show the window as dark mode.
	#applyDarkMode() {
		this.#applySetting(AppSettingsConstant.DARK_MODE, (value) => {
			Menu.getApplicationMenu().getMenuItemById("view/dark-mode").checked = value;
			ipc.raise(IpcToRenderer.TOGGLE__DARKMODE, [value]);
		}, () => {
			Menu.getApplicationMenu().getMenuItemById("view/dark-mode").checked = false;
			ipc.raise(IpcToRenderer.TOGGLE__DARKMODE, [false]);
		});
	}

	#applyIsThumbnailsVisible() {
		this.#applySetting(AppSettingsConstant.THUMBNAILS_VISILE, (value) => {
			Menu.getApplicationMenu().getMenuItemById("view/thumbnails").checked = value;
			ipc.raise(IpcToRenderer.APPLY__SETTING, [AppSettingsConstant.THUMBNAILS_VISILE, value]);
		}, () => {
			ipc.raise(IpcToRenderer.APPLY__SETTING, [AppSettingsConstant.THUMBNAILS_VISILE, true]);
		});
	}
	
	#applyIsSidebarVisible() {
		this.#applySetting(AppSettingsConstant.SIDEBAR_VISIBLE, (value) => {
			Menu.getApplicationMenu().getMenuItemById("view/sidebar").checked = value;
			ipc.raise(IpcToRenderer.APPLY__SETTING, [AppSettingsConstant.SIDEBAR_VISIBLE, value]);
		}, () => {
			ipc.raise(IpcToRenderer.APPLY__SETTING, [AppSettingsConstant.SIDEBAR_VISIBLE, true]);
		});
	}

	#applySidebarPosition() {
		this.#applySetting(AppSettingsConstant.SIDEBAR_POSITION, (value) => {
			Menu.getApplicationMenu().getMenuItemById(`view/sidebar-position/${value}`).checked = true;
			ipc.raise(IpcToRenderer.APPLY__SETTING, [AppSettingsConstant.SIDEBAR_POSITION, value]);
		}, () => {
			ipc.raise(IpcToRenderer.APPLY__SETTING, [AppSettingsConstant.SIDEBAR_POSITION, "right"]);
		});
	}

	/** Applies a setting by calling either the onValue function with the key value if the key is present, or the onDefault function if the key is not present. */
	#applySetting(key, onValue, onDefault) {
		if (!this.#appSettings.hasOwnProperty(key)) {
			onDefault();
			return;
		}

		onValue(this.#appSettings[key]);
	}
}

export const appSettings = new AppSettings();