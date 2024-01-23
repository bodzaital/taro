import { app, dialog, net, protocol } from "electron";
import { CH_CLOSE_FOLDER, CH_LOAD_IMAGES, CH_NO_IMAGES, CH_OPEN_CANCELED } from "../ipcConstants";
import path from "path";
import { ipc } from "./ipc";
import FolderInfo from "../data/folderInfo";
import fs from "fs";
import Metadata from "../data/metadata";
import ExifReader from "exifreader";

class IO {
	static TARO_HANDLE = "taro";
	static TARO_METADATA_FILENAME = "taro.metadata.json";
	static SUPPORTED_PHOTO_EXTENSIONS = [".jpg"];

	registerTaroProtocol() {
		protocol.handle(IO.TARO_HANDLE, (request) => {
			const fileProto = "file://";
			const taroProto = IO.TARO_HANDLE + "://";
			const rawUri = request.url.slice(taroProto.length);

			return net.fetch(fileProto + rawUri);
		});
	}

	openFolderHandler() {
		const folderPath = this.#getFolderPathFromDialog();
		if (folderPath == null) {
			ipc.raise(CH_OPEN_CANCELED);
			return;
		}

		const listOfImageURIs = this.#getListOfImageURIs(folderPath);
		
		if (listOfImageURIs.length == 0) {
			ipc.raise(CH_NO_IMAGES);
			return;
		}
		
		this.#ensureMetadataFileExists(folderPath);
		const baseName = path.basename(folderPath);
		ipc.raise(CH_LOAD_IMAGES, [new FolderInfo(baseName, listOfImageURIs)]);
	}
	
	closeFolderHandler() {
		ipc.raise(CH_CLOSE_FOLDER);
	}

	exifHandler(uri) {
		const data = ExifReader.load(uri);
		return data;
	}

	// TODO: (settings) I guess refactor these methods.
	// TODO: (settings) General idea behind the settings: an apply method will (1) load the settings file, (2) 
	// read and set values in the main process including raising necessary events to the renderer.
	// This apply method then can be called after startup or whenever we want to refresh the settings (e.g. after saving).
	openSettings() {
		const settingsFileUri = this.#getSettingsUri();

		if (!fs.existsSync(settingsFileUri)) fs.writeFileSync(settingsFileUri, {});

		const settings = JSON.parse(fs.readFileSync(settingsFileUri));

		return settings;
	}

	saveSettings(key, value) {
		const settingsFileUri = this.#getSettingsUri();
		const settings = JSON.parse(fs.readFileSync(settingsFileUri));

		settings[key] = value;

		fs.writeFileSync(settingsFileUri, JSON.stringify(settings));
	}

	#getSettingsUri() {
		return path.join(app.getPath("userData"), "settings.json");
	}
	
	#getFolderPathFromDialog() {
		const selectedFolderPaths = dialog.showOpenDialogSync({
			properties: ["openDirectory"]
		});

		if (selectedFolderPaths == undefined) return null;
		
		return selectedFolderPaths[0];
	}
	
	#getListOfImageURIs(folderPath) {
		return fs.readdirSync(folderPath)
			.filter((file) => file[0] != ".")
			.map((file) => path.join(folderPath, file))
			.map((uri) => uri.toLowerCase())
			.filter((file) => IO.SUPPORTED_PHOTO_EXTENSIONS.includes(path.extname(file)));
	}

	#ensureMetadataFileExists(folderPath) {
		const taroMetadataPath = path.join(folderPath, IO.TARO_METADATA_FILENAME);

		if (fs.existsSync(taroMetadataPath)) {
			return;
		}

		// TODO: create actual empty metadata.
		fs.writeFileSync(taroMetadataPath, JSON.stringify(new Metadata("hello")));
	}
}

export const io = new IO();