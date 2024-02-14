import './index.scss';
import { folder } from './renderer/folder';
import { sidebar } from "./renderer/sidebar";
import { $ } from './renderer/shorthand';
import { notifications } from './renderer/inAppNotifications';
import { thumbnail } from './renderer/thumbnail';
import { AppSettingsConstant } from "./data/appsettingsConstants";
import { settings } from './renderer/settings';

folder.unloadFolder();

window.listen.openFolder((folderInfo) => {
	folder.loadFolder(folderInfo);
});

window.listen.closeFolder(() => {
	folder.unloadFolder();
});

window.listen.showAlert((message, style) => {
	notifications.create(message, style);
});

window.listen.applySetting((key, value) => {
	settings.set(key, value);
	
	if (key == AppSettingsConstant.SIDEBAR_VISIBLE) {
		sidebar.toggleSidebar(value);
	}

	if (key == AppSettingsConstant.THUMBNAILS_VISILE) {
		thumbnail.toggleThumbnail(value);
	}

	if (key == AppSettingsConstant.SIDEBAR_POSITION) {
		sidebar.changePosition(value);
	}

	if (key == AppSettingsConstant.DARK_MODE) {
		$("html").dataset.bsTheme = value;
	}
});

window.listen.showSettingsModal(() => {
	// TODO: close last modal when opening a modal.
	new bootstrap.Modal($("#settingsModal")).show();
});