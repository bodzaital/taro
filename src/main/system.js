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
			applicationVersion: "Alpha",
			version: "v0.2.1",
			credits: "",
			copyright: "Copyright ©️ 2023-2024 - Zsolt Boda"
		});
	}

	registerMenu() {
		const isMacOS = process.platform == "darwin";

		const applicationMenu = this.#getApplicationMenu(isMacOS);
		const fileMenu = this.#getFileMenu(isMacOS);
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
				{
					label: "Settings...",
					click: () => appSettings.showModal(),
					id: "app/settings"
				},
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

	#getFileMenu(isMacOS) {
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
					id: "file/close-folder",
					enabled: false,
					accelerator: "CmdOrCtrl+W"
				},
				{ type: "separator" },
				{
					label: `Reveal Folder in ${isMacOS ? "Finder" : "File Explorer"}`,
					click: () => io.revealInFileExplorerHandler(),
					accelerator: "CmdOrCtrl+Alt+R",
					id: "file/reveal-folder",
					enabled: false
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
				{
					label: "Sidebar Position",
					submenu: [
						{
							label: "Left",
							id: "view/sidebar-position/left",
							type: "radio",
							click: (item) => this.#handleSidebarPosition(item)
						},
						{
							label: "Right",
							id: "view/sidebar-position/right",
							type: "radio",
							checked: true,
							click: (item) => this.#handleSidebarPosition(item)
						},
					]
				},
				{ type: "separator" },
				{
					label: "Thumbnails",
					type: "checkbox",
					id: "view/thumbnails",
					click: (item) => this.#handleToggleThumbnails(item),
					accelerator: "CmdOrCtrl+X"
				},
				{
					label: "Sidebar",
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
				? "dark"
				: "light"
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

	#handleSidebarPosition(item) {
		if (!item.checked) return;
		
		const setting = {
			key: AppSettingsConstant.SIDEBAR_POSITION,
			value: item.label.toLowerCase()
		}
		
		appSettings.updateAndApply([setting]);
	}
}

export const system = new System();