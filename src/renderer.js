import './index.scss';
import { updateNavigatorStates } from './renderer/navigator';
import { createThumbnails, selectFirstThumbnail, showSelectedThumbnail } from './renderer/thumbnail';

// On startup no folder is selected, so disable the navigators.
updateNavigatorStates("disabled", "disabled");

window.ipc.loadImages((listOfImageUris) => {
	createThumbnails(listOfImageUris);
	selectFirstThumbnail();
	showSelectedThumbnail();
	updateNavigatorStates();
});

window.ipc.closeFolder(() => {
	// clearThumbnails();
	// clearPhoto();
});