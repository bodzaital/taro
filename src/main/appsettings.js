import { app } from "electron";
import path from "path";
import fs from "fs";

class AppSettings {
	#settings = null;

	applySettings() {
		this.#open();
		this.#apply();
	}

	changeSetting(keyValuePairs) {
		this.#open();
		this.#update(keyValuePairs);
		this.#apply();
		this.#write();
	}

	#open() {
		const settingsFileUri = path.join(app.getPath("userData"), "settings.json");

		if (!fs.existsSync(settingsFileUri)) fs.writeFileSync(settingsFileUri, {});
		const settings = JSON.parse(fs.readFileSync(settingsFileUri));

		return settings;
	}

	#update(keyValuePairs) {
		keyValuePairs.forEach((keyValuePair) => {
			this.#settings[keyValuePair.key] = keyValuePair.value;
		});
	}

	#apply() {
		// TODO: the interesting part.
	}

	#write() {
		const settingsFileUri = path.join(app.getPath("userData"), "settings.json");

		const contents = JSON.stringify(this.#settings);
		fs.writeFileSync(settingsFileUri, contents);
	}
}

export const appSettings = new AppSettings();