import './index.scss';
import { folder } from './renderer/folder';
import { $ } from './renderer/shorthand';

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

window.ipc.noImages(() => {
	// TODO: make this nicer.
	alert("There are no images in this folder.");
});