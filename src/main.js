const { app, BrowserWindow, Menu } = require('electron');
// const { registerAboutPanel, registerMenu } = require('./main/system');
// const { registerTaroProtocol } = require('./main/io');
const { ipc } = require('./main/ipc');
const { io } = require('./main/io');
const { CH_TOGGLE_DARK_MODE } = require('./ipcConstants');
const { appSettings } = require('./main/appsettings');
const { system } = require('./main/system');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
		titleBarStyle: "hidden",
		trafficLightPosition: { x: 18, y: 18 }
	});

	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	ipc.init(mainWindow);

	system.registerOnStartup();

	ipc.register();

	// TODO: (settings) refactor into separate class for waiting for the DOM.
	mainWindow.webContents.once("dom-ready", () => {
		appSettings.apply();
	});
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	// if (process.platform !== 'darwin') {
		app.quit();
	// }
});

// app.on('activate', () => {
// 	// On OS X it's common to re-create a window in the app when the
// 	// dock icon is clicked and there are no other windows open.
// 	if (BrowserWindow.getAllWindows().length === 0) {
// 		createWindow();
// 	}
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

app.whenReady().then(() => {
	io.registerTaroProtocol();
});