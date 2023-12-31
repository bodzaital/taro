import { Menu, app } from "electron";
import { closeFolderHandler, openFolderHandler } from "./io";

/** Registers the about panel and sets the basic values on it. */
export function registerAboutPanel() {
	app.setAboutPanelOptions({
		applicationName: "fab - Photography Organization",
		applicationVersion: "Pre-Alpha",
		version: "v0.1",
		credits: "",
		copyright: "Copyright ©️ 2023 - Zsolt Boda"
	});
}

/** Registers the menu with macOS support. */
export function registerMenu() {
	const isMacOS = process.platform == "darwin";

	const applicationMenu = getApplicationMenu(isMacOS);
	const fileMenu = getFileMenu();

	const menu = [
		...applicationMenu,
		...fileMenu
	]

	Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}

function getApplicationMenu(isMacOS) {
	return isMacOS ? [{
		label: app.name,
		submenu: [
			{ role: "about" },
			{ type: "separator" },
			{ role: "services" },
			{ type: "separator" },
			{ role: "hide" },
			{ role: "hideOthers" },
			{ role: "unhide" },
			{ type: "separator" },
			{ role: "quit" }
		]
	}] : [];
}

function getFileMenu() {
	return [{
		label: "File",
		submenu: [
			{
				label: "Open Folder",
				click: () => openFolderHandler()
			},
			{
				label: "Close Folder",
				click: () => closeFolderHandler()
			}
		]
	}];
}