import './index.scss';
import { folder } from './renderer/folder';
import { sidebar } from "./renderer/sidebar";
import { $ } from './renderer/shorthand';
import { notifications } from './renderer/inAppNotifications';
import { thumbnail } from './renderer/thumbnail';
import { AppSettingsConstant } from "./data/appsettingsConstants";
import { support } from './renderer/support';
import { i18n } from './renderer/i18n';
import { appSettingsInRenderer } from "./renderer/appSettingsInRenderer";

folder.unloadFolder();
// i18n.changeLanguage("hu");

window.listen.openFolder((folderPath, baseName, listOfImageURIs) => {
	folder.loadFolder(folderPath, baseName, listOfImageURIs);
});

window.listen.closeFolder(() => {
	folder.unloadFolder();
});

window.listen.showAlert((message, style) => {
	notifications.create(message, style);
});

window.listen.showSettingsModal(() => {
	// TODO: close last modal when opening a modal.
	new bootstrap.Modal($("#settingsModal")).show();
});