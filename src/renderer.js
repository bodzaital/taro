import './index.scss';
import { folder } from './renderer/folder';
import { $ } from './renderer/shorthand';

window.ipc.loadImages((listOfImageUris, folderName) => {
	folder.loadFolder(listOfImageUris);
});

window.ipc.closeFolder(() => {
	folder.unloadFolder();
});

window.ipc.toggleDarkMode((isDarkMode) => {
	$("html").dataset.bsTheme = isDarkMode
		? "dark"
		: "light";
});