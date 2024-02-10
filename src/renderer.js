import './index.scss';
import { folder } from './renderer/folder';
import { sidebar } from "./renderer/sidebar";
import { $ } from './renderer/shorthand';
import { notifications } from './renderer/inAppNotifications';
import { thumbnail } from './renderer/thumbnail';
import { AppSettingsConstant } from "./data/appsettingsConstants";
import { support } from './renderer/support';

folder.unloadFolder();

window.ipc.loadImages((folderInfo) => {
	folder.loadFolder(folderInfo);
});

window.ipc.closeFolder(() => {
	folder.unloadFolder();
});

window.ipc.toggleDarkMode((isDarkMode) => {
	$("html").dataset.bsTheme = isDarkMode
		? "dark"
		: "light";
});

window.ipc.showAlert((message, style) => {
	notifications.create(message, style);
});

window.ipc.applySetting((key, value) => {
	if (key == AppSettingsConstant.SIDEBAR_VISIBLE) {
		sidebar.toggleSidebar(value);
	}

	if (key == AppSettingsConstant.THUMBNAILS_VISILE) {
		thumbnail.toggleThumbnail(value);
	}
});