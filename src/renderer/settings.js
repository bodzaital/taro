import { AppSettingsConstant } from "../data/appsettingsConstants";

class Settings {
	// TODO: dynamically create the settings panel from appsettings definition
	// TODO: dynamically load the elements here
	set(key, value) {
		if (key == AppSettingsConstant.SIDEBAR_POSITION) {
			// TODO: dynamically set the element values
		}
	}

	save() {
	
	}
}

export const settings = new Settings();