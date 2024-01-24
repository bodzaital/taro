import { Menu, app } from "electron";
import path from "path";
import fs from "fs";
import { ipc } from "./ipc";
import { CH_TOGGLE_DARK_MODE } from "../ipcConstants";

export class AppSettings {
	static DARK_MODE = "darkMode";

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
	}

	#write() {
		if (this.#appSettings == null) throw new Error("AppSettings is not loaded.");

		const settingsFileUri = path.join(app.getPath("userData"), "settings.json");
		const contents = JSON.stringify(this.#appSettings);
		
		fs.writeFileSync(settingsFileUri, contents);
		
		this.#appSettings = null;
	}

	#applyDarkMode() {
		this.#applySetting(AppSettings.DARK_MODE, (value) => {
			Menu.getApplicationMenu().getMenuItemById("view/dark-mode").checked = value;
			ipc.raise(CH_TOGGLE_DARK_MODE, [value]);
		}, () => {
			Menu.getApplicationMenu().getMenuItemById("view/dark-mode").checked = false;
			ipc.raise(CH_TOGGLE_DARK_MODE, [false]);
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