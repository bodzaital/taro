import { Menu, app } from "electron";
import { closeFolderHandler, openFolderHandler } from "./io";
// import { raiseEvent } from "./ipc";
import { CH_TOGGLE_DARK_MODE } from "../ipcConstants";
import { ipc } from "./ipc";

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
	const fileMenu = getFileMenu(isMacOS);
	const viewMenu = getViewMenu(isMacOS);
	const toolsMenu = getToolsMenu(isMacOS);

	const menu = [
		...applicationMenu,
		...fileMenu,
		...viewMenu,
		...toolsMenu
	];

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

function getFileMenu(isMacOS) {
	return [{
		label: "File",
		submenu: [
			{
				label: "Open Folder",
				click: () => openFolderHandler(),
				accelerator: isMacOS ? "Cmd+O" : "Ctrl+O"
			},
			{
				label: "Close Folder",
				click: () => closeFolderHandler(),
				accelerator: isMacOS ? "Cmd+W" : "Ctrl+W"
			}
		]
	}];
}

function getViewMenu(isMacOS) {
	return [{
		label: "View",
		submenu: [
			{
				label: "Dark mode",
				type: "checkbox",
				id: "view/dark-mode",
				click: () => toggleDarkMode(),
				accelerator: isMacOS ? "Cmd+Option+L" : "Ctrl+Alt+L"
			}
		]
	}];
}

function getToolsMenu(isMacOS) {
	return [{
		label: "Tools",
		submenu: [
			{
				role: "toggleDevTools",
				accelerator: "F12"
			}
		]
	}];
}

// TODO: refactor this
function toggleDarkMode() {
	const isDarkMode = Menu.getApplicationMenu().getMenuItemById("view/dark-mode").checked;

	ipc.raise(CH_TOGGLE_DARK_MODE, [isDarkMode]);
}