import { AppSettingsConstant } from "../data/appsettingsConstants";
import { $, $$ } from "./shorthand";

class Settings {
	#saveButton = $("#settingsSave");

	#controls = {
		sidebarVisibleCheckbox: $("#settingSidebarVisible"),
		thumbnailsVisibleCheckbox: $("#settingThumbnailsVisible"),
		sidebarPosition: {
			all: $$("[name='settingSidebar']"),
			leftRadio: $("#settingSidebarLeft"),
			rightRadio: $("#settingSidebarRight")
		},
		darkMode: {
			all: $$("[name='settingDarkMode']"),
			darkRadio: $("#settingDarkModeDark"),
			lightRadio: $("#settingDarkModeLight")
		}
	};

	constructor() {
		this.#saveButton.addEventListener("click", () => {
			this.save();
		});
	}

	set(key, value) {
		if (key == AppSettingsConstant.SIDEBAR_VISIBLE) {
			this.#controls.sidebarVisibleCheckbox.checked = value;
		}

		if (key == AppSettingsConstant.THUMBNAILS_VISILE) {
			this.#controls.thumbnailsVisibleCheckbox.checked = value;
		}

		if (key == AppSettingsConstant.SIDEBAR_POSITION) {
			this.#controls.sidebarPosition.all.forEach((x) => x.checked = false);

			if (value == "left") {
				this.#controls.sidebarPosition.leftRadio.checked = true;
			} else {
				this.#controls.sidebarPosition.rightRadio.checked = true;
			}
		}

		if (key == AppSettingsConstant.DARK_MODE) {
			this.#controls.darkMode.all.forEach((x) => x.checked = false);

			if (value == "dark") {
				this.#controls.darkMode.darkRadio.checked = true;
			} else {
				this.#controls.darkMode.lightRadio.checked = true;
			}
		}
	}

	#getSidebarVisible() {
		return this.#controls.sidebarVisibleCheckbox.checked;
	}

	#getThumbnailsVisible() {
		return this.#controls.thumbnailsVisibleCheckbox.checked;
	}

	#getSidebarPosition() {
		if (this.#controls.sidebarPosition.leftRadio.checked) return "left";

		return "right";
	}

	#getDarkMode() {
		if (this.#controls.darkMode.darkRadio.checked) return "dark";

		return "light";
	}

	save() {
		window.invoke.saveSettings([
			{ "key": AppSettingsConstant.SIDEBAR_VISIBLE, "value": this.#getSidebarVisible() },
			{ "key": AppSettingsConstant.THUMBNAILS_VISILE, "value": this.#getThumbnailsVisible() },
			{ "key": AppSettingsConstant.SIDEBAR_POSITION, "value": this.#getSidebarPosition() },
			{ "key": AppSettingsConstant.DARK_MODE, "value": this.#getDarkMode() }
		]);
	}
}

export const settings = new Settings();