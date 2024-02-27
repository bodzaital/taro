import { Menu, app, nativeTheme } from "electron";
import path from "path";
import fs from "fs";
import { ipc } from "./ipc";
import { IpcToRenderer } from "../data/ipcConstants";
import { AppSettingsConstant } from "../data/appsettingsConstants";

class AppSettings {
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

	showModal() {
		ipc.raise(IpcToRenderer.SHOW__SETTINGS_MODAL);
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
		this.#applyLanguage();
	}

	#write() {
		if (this.#appSettings == null) throw new Error("AppSettings is not loaded.");

		const settingsFileUri = path.join(app.getPath("userData"), "settings.json");
		const contents = JSON.stringify(this.#appSettings);
		
		fs.writeFileSync(settingsFileUri, contents);
		
		this.#appSettings = null;
	}

	// TODO: allow to follow system color mode. Also: set the appropriate system setting to show the window as dark mode.
	// TODO: refactor to apply__setting every time.
	#applyDarkMode() {
		this.#applySetting(AppSettingsConstant.DARK_MODE, (value) => {
			Menu.getApplicationMenu().getMenuItemById("view/dark-mode").checked = value == "dark";
			nativeTheme.themeSource = value;
			ipc.raise(IpcToRenderer.APPLY__SETTING, AppSettingsConstant.DARK_MODE, value);
		}, () => {
			Menu.getApplicationMenu().getMenuItemById("view/dark-mode").checked = false;
			nativeTheme.themeSource = "light";
			ipc.raise(IpcToRenderer.APPLY__SETTING, AppSettingsConstant.DARK_MODE, "light");
		});
	}

	#applyIsThumbnailsVisible() {
		this.#applySetting(AppSettingsConstant.THUMBNAILS_VISIBLE, (value) => {
			Menu.getApplicationMenu().getMenuItemById("view/thumbnails").checked = value;
			ipc.raise(IpcToRenderer.APPLY__SETTING, AppSettingsConstant.THUMBNAILS_VISIBLE, value);
		}, () => {
			ipc.raise(IpcToRenderer.APPLY__SETTING, AppSettingsConstant.THUMBNAILS_VISIBLE, true);
		});
	}
	
	#applyIsSidebarVisible() {
		this.#applySetting(AppSettingsConstant.SIDEBAR_VISIBLE, (value) => {
			Menu.getApplicationMenu().getMenuItemById("view/sidebar").checked = value;
			ipc.raise(IpcToRenderer.APPLY__SETTING, AppSettingsConstant.SIDEBAR_VISIBLE, value);
		}, () => {
			ipc.raise(IpcToRenderer.APPLY__SETTING, AppSettingsConstant.SIDEBAR_VISIBLE, true);
		});
	}

	#applySidebarPosition() {
		this.#applySetting(AppSettingsConstant.SIDEBAR_POSITION, (value) => {
			Menu.getApplicationMenu().getMenuItemById(`view/sidebar-position/${value}`).checked = true;
			ipc.raise(IpcToRenderer.APPLY__SETTING, AppSettingsConstant.SIDEBAR_POSITION, value);
		}, () => {
			ipc.raise(IpcToRenderer.APPLY__SETTING, AppSettingsConstant.SIDEBAR_POSITION, "right");
		});
	}

	#applyLanguage() {
		this.#applySetting(AppSettingsConstant.LANGUAGE, (value) => {
			ipc.raise(IpcToRenderer.APPLY__SETTING, AppSettingsConstant.LANGUAGE, value);
		}, () => {
			ipc.raise(IpcToRenderer.APPLY__SETTING, AppSettingsConstant.LANGUAGE, "en");
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