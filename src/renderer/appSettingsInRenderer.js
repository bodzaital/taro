import { AppSettingsConstant } from "../data/appsettingsConstants";
import { $, $$ } from "./shorthand";

class AppSettingsInRenderer {
	#saveButton = $("#settingsSave");

	#controls = {
		sidebarVisibleCheckbox: $("#settingSidebarVisible"),
		thumbnailsVisibleCheckbox: $("#settingThumbnailsVisible"),
		sidebarPosition: {
			all: $$("[name='settingSidebar']"),
			leftRadio: $("#settingSidebarLeft"),
			rightRadio: $("#settingSidebarRight"),
		},
		darkMode: {
			all: $$("[name='settingDarkMode']"),
			darkRadio: $("#settingDarkModeDark"),
			lightRadio: $("#settingDarkModeLight"),
		},
	};

	constructor() {
		this.#saveButton.addEventListener("click", () => this.#saveSettings());

		window.listen.applySetting((key, value) => this.#setControls(key, value));
	}

	#setControls(key, value) {
		if (key == AppSettingsConstant.SIDEBAR_VISIBLE) {
			this.#controls.sidebarVisibleCheckbox.checked = value;
		}

		if (key == AppSettingsConstant.THUMBNAILS_VISIBLE) {
			this.#controls.thumbnailsVisibleCheckbox.checked = value;
		}

		if (key == AppSettingsConstant.SIDEBAR_POSITION) {
			this.#controls.sidebarPosition.leftRadio.checked = value == "left";
			this.#controls.sidebarPosition.rightRadio.checked = value == "right";
		}

		if (key == AppSettingsConstant.DARK_MODE) {
			this.#controls.darkMode.darkRadio.checked = value == "dark";
			this.#controls.darkMode.lightRadio.checked = value == "light";
		}
	}

	#saveSettings() {
		window.invoke.saveSettings([
			{ "key": AppSettingsConstant.SIDEBAR_VISIBLE, "value": this.#getSidebarVisible() },
			{ "key": AppSettingsConstant.THUMBNAILS_VISIBLE, "value": this.#getThumbnailsVisible() },
			{ "key": AppSettingsConstant.SIDEBAR_POSITION, "value": this.#getSidebarPosition() },
			{ "key": AppSettingsConstant.DARK_MODE, "value": this.#getDarkMode() }
		]);
	}

	#getSidebarVisible() {
		return this.#controls.sidebarVisibleCheckbox.checked;
	}

	#getThumbnailsVisible() {
		return this.#controls.thumbnailsVisibleCheckbox.checked;
	}

	#getSidebarPosition() {
		return this.#controls.sidebarPosition.leftRadio.checked
			? "left"
			: "right";
	}

	#getDarkMode() {
		return this.#controls.darkMode.darkRadio.checked
			? "dark"
			: "light";
	}
}

export const appSettingsInRenderer = new AppSettingsInRenderer();