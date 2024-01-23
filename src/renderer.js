import './index.scss';
import { folder } from './renderer/folder';
import { sidebar } from "./renderer/sidebar";
import { $ } from './renderer/shorthand';
import { notifications } from './renderer/inAppNotifications';

window.ipc.loadImages((folderInfo) => {
	folder.loadFolder(folderInfo);
});

window.ipc.closeFolder(() => {
	folder.unloadFolder();
});

window.ipc.toggleDarkMode((isDarkMode) => {
	console.log(isDarkMode);
	$("html").dataset.bsTheme = isDarkMode
		? "dark"
		: "light";
});

window.ipc.noImages(() => {
	// TODO: make this nicer.
	// alert("There are no images in this folder.");
	notifications.create("There are no images in this folder.", "warning");
});

window.ipc.openCanceled(() => {
	// TODO: make this nicer.
	// alert("Open folder canceled.");
	notifications.create("Opening a folder is canceled.", "info");
})