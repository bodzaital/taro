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
import Control from './renderer/control';
import { confirmModal } from './renderer/confirmModal';

window.invoke.applySettings();
folder.unloadFolder();

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

// window.listen.showConfirmDialog((title, paragraphs, negative, positive) => {
// 	const confirmModalTitle = $("#confirmModalTitle");
// 	const confirmModalBody = $("#confirmModalBody");
// 	const confirmModalNegative = $("#confirmModalNegative");
// 	const confirmModalPositive = $("#confirmModalPositive");

// 	confirmModalTitle.innerText = title;
// 	paragraphs.forEach((line) => confirmModalBody.appendChild(new Control("p").text(line).get()));
// 	confirmModalNegative.innerText = negative;
// 	confirmModalPositive.innerText = positive;

// 	new bootstrap.Modal($("#confirmModal")).show();
// });