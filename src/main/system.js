import { Menu, app } from "electron";
import { io } from "./io";
import { CH_TOGGLE_DARK_MODE } from "../ipcConstants";
import { ipc } from "./ipc";
import { AppSettings, appSettings } from "./appsettings";

/** Registers the about panel and sets the basic values on it. */
export function registerAboutPanel() {
	app.setAboutPanelOptions({
		applicationName: "taro - Photography Organization",
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
				click: () => io.openFolderHandler(),
				accelerator: isMacOS ? "Cmd+O" : "Ctrl+O"
			},
			{
				label: "Close Folder",
				click: () => io.closeFolderHandler(),
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
	// TODO: (settings) handle setting initial state correctly after loading the settings (e.g. make sure the checkbox is checked if darkMode setting is on, not just the visuals).
	const isDarkMode = Menu.getApplicationMenu().getMenuItemById("view/dark-mode").checked;

	// ipc.raise(CH_TOGGLE_DARK_MODE, [isDarkMode]);

	appSettings.changeSetting([
		{ key: AppSettings.DARK_MODE, value: isDarkMode }
	]);
}