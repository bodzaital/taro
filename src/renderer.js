import './index.scss';
import { folder } from './renderer/folder';
import { windowFrame } from './renderer/windowFrame';

window.ipc.loadImages((listOfImageUris, folderName) => {
	folder.loadFolder(listOfImageUris);
});

window.ipc.closeFolder(() => {
	folder.unloadFolder();
	windowFrame.unloadFolder();
});