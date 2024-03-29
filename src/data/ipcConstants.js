export class IpcToRenderer {
	static OPEN__FOLDER = "openFolder";
	static CLOSE__FOLDER = "closeFolder";
	static TOGGLE__DARKMODE = "toggleDarkMode";
	static SHOW__ALERT = "showAlert";
	static APPLY__SETTING = "applySetting";
	static SHOW__SETTINGS_MODAL = "showSettingsModal";
	static SHOW__CONFIRM_DIALOG = "showConfirmDialog";
}

export class IpcToMain {
	static SELECT__FOLDER = "selectFolder";
	static SELECT__WELCOME_FOLDER = "selectWelcomeFolder";
	static TOGGLE__WELCOME_DARK_MODE = "toggleWelcomeDarkMode";
	static SAVE__SETTINGS = "saveSettings";
	static GET__EXIF = "getExif";
	static GET__METADATA = "getMetadata";
	static WRITE__METADATA = "writeMetadata";
	static GET__EVERY_TAG = "getEveryTag";
	static OPEN__SETTINGS_JSON = "openSettingsJson";
	static APPLY__SETTINGS = "applySettings";
	static REPLY__CONFIRM_DIALOG = "replyConfirmDialog";
}