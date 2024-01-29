import { Menu, app } from "electron";
import { io } from "./io";
import { appSettings } from "./appsettings";
import { AppSettingsConstant } from "../data/appsettingsConstants";

class System {
	#mainWindow = null;

	/** Registers the about panel and the menu, to be called on startup. */
	registerOnStartup(mainWindow) {
		this.registerAboutPanel();
		this.registerMenu();

		this.#mainWindow = mainWindow;
	}

	registerAboutPanel() {
		app.setAboutPanelOptions({
			applicationName: "taro - Photography Organization",
			applicationVersion: "Pre-Alpha",
			version: "v0.1.1",
			credits: "",
			copyright: "Copyright ©️ 2023-2024 - Zsolt Boda"
		});
	}

	registerMenu() {
		const isMacOS = process.platform == "darwin";

		const applicationMenu = this.#getApplicationMenu(isMacOS);
		const fileMenu = this.#getFileMenu();
		const viewMenu = this.#getViewMenu();
		const toolsMenu = this.#getToolsMenu();

		const menu = [
			...applicationMenu,
			...fileMenu,
			...viewMenu,
			...toolsMenu
		];

		Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
	}

	#getApplicationMenu(isMacOS) {
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

	#getFileMenu() {
		return [{
			label: "File",
			submenu: [
				{
					label: "Open Folder",
					click: () => io.openFolderHandler(),
					accelerator: "CmdOrCtrl+O"
				},
				{
					label: "Close Folder",
					click: () => io.closeFolderHandler(),
					accelerator: "CmdOrCtrl+W"
				}
			]
		}];
	}

	#getViewMenu() {
		return [{
			label: "View",
			submenu: [
				{
					label: "Dark Mode",
					type: "checkbox",
					id: "view/dark-mode",
					click: (item) => this.#handleViewDarkMode(item),
					accelerator: "CmdOrCtrl+Alt+L"
				},
				{ type: "separator" },
				{
					label: "Toggle Thumbnails",
					type: "checkbox",
					id: "view/thumbnails",
					click: (item) => this.#handleToggleThumbnails(item),
					accelerator: "CmdOrCtrl+X"
				},
				{
					label: "Toggle Sidebar",
					type: "checkbox",
					id: "view/sidebar",
					click: (item) => this.#handleToggleSidebar(item),
					accelerator: "CmdOrCtrl+B"
				},
				{ type: "separator" },
				{
					label: "Full Screen",
					type: "checkbox",
					id: "view/full-screen",
					click: (item) => this.#handleFullScreen(item),
					accelerator: "CmdOrCtrl+F"
				}
			]
		}];
	}

	#getToolsMenu() {
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

	#handleViewDarkMode(item) {
		const setting = {
			key: AppSettingsConstant.DARK_MODE,
			value: item.checked
		};

		appSettings.updateAndApply([setting]);
	}

	#handleToggleThumbnails(item) {
		const setting = {
			key: AppSettingsConstant.THUMBNAILS_VISILE,
			value: item.checked
		};

		appSettings.updateAndApply([setting]);
	}

	#handleToggleSidebar(item) {
		const setting = {
			key: AppSettingsConstant.SIDEBAR_VISIBLE,
			value: item.checked
		};

		appSettings.updateAndApply([setting]);
	}

	#handleFullScreen(item) {
		if (this.#mainWindow.isFullScreen()) {
			this.#mainWindow.setFullScreen(false);
		} else {
			this.#mainWindow.setFullScreen(true);
		}
	}
}

export const system = new System();