import './index.scss';
import { folder } from './renderer/folder';
import { updateTitleSearchBarPlaceholder } from './renderer/frame';

window.ipc.loadImages((listOfImageUris, folderName) => {
	updateTitleSearchBarPlaceholder(folderName);
	folder.loadFolder(listOfImageUris);
});

window.ipc.closeFolder(() => {
	folder.unloadFolder();
});