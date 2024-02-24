import { Menu, app, dialog, net, protocol } from "electron";
import { CH_CLOSE_FOLDER, CH_LOAD_IMAGES, CH_NO_IMAGES, CH_OPEN_CANCELED, CH_SHOW_ALERT, IpcConstants, IpcToRenderer } from "../data/ipcConstants";
import path, { basename } from "path";
import { ipc } from "./ipc";
import fs from "fs";
import Metadata from "../data/metadata";
import ExifReader from "exifreader";
import { exec } from "child_process";

class IO {
	static TARO_HANDLE = "taro";
	static TARO_METADATA_FOLDER_NAME = ".taro";
	static TARO_METADATA_FILENAME = "taro.metadata.json";
	static SUPPORTED_PHOTO_EXTENSIONS = [".jpg"];

	#folderPath = null;

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
			ipc.raise(IpcToRenderer.SHOW__ALERT, "Opening a folder is canceled.", "info");
			return;
		}

		this.#folderPath = folderPath;

		const listOfImageURIs = this.#getListOfImageURIs(folderPath);
		
		if (listOfImageURIs.length == 0) {
			ipc.raise(IpcToRenderer.SHOW__ALERT, "There are no images in this folder.", "warning");
			return;
		}
		
		Menu.getApplicationMenu().getMenuItemById("file/close-folder").enabled = true;
		Menu.getApplicationMenu().getMenuItemById("file/reveal-folder").enabled = true;

		ipc.raise(
			IpcToRenderer.OPEN__FOLDER,
			folderPath,
			path.basename(folderPath),
			listOfImageURIs
		);
	}
	
	closeFolderHandler() {
		Menu.getApplicationMenu().getMenuItemById("file/close-folder").enabled = false;
		Menu.getApplicationMenu().getMenuItemById("file/reveal-folder").enabled = false;
		this.#folderPath = null;
		ipc.raise(IpcToRenderer.CLOSE__FOLDER);
	}

	exifHandler(uri) {
		const data = ExifReader.load(uri);
		return data;
	}

	getMetadataHandler(folder, photo) {
		const taroMetadataFolder = path.join(this.#folderPath, IO.TARO_METADATA_FOLDER_NAME);

		if (!fs.existsSync(taroMetadataFolder)) fs.mkdirSync(taroMetadataFolder);

		const photoMetadataFile = path.join(
			taroMetadataFolder,
			`${photo}.json`
		);

		if (!fs.existsSync(photoMetadataFile)) {
			const created = new Date().toISOString();
			fs.writeFileSync(photoMetadataFile, JSON.stringify(new Metadata(photo, created)));
		}

		const metadata = JSON.parse(fs.readFileSync(photoMetadataFile));

		return metadata;
	}

	writeMetadataHandler(folder, metadata) {
		const taroMetadataFolder = path.join(this.#folderPath, IO.TARO_METADATA_FOLDER_NAME);

		const photoMetadataFile = path.join(
			taroMetadataFolder,
			`${metadata.photo}.json`
		);

		fs.writeFileSync(photoMetadataFile, JSON.stringify(metadata));
	}

	revealInFileExplorerHandler() {
		exec(`open ${this.#folderPath}`);
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

	getAllTagsHandler(folder) {
		const metadataFolder = path.join(folder, ".taro");
		
		const listOfMetadataFiles = fs.readdirSync(metadataFolder)
			.filter((file) => file[0] != ".")
			.map((file) => path.join(metadataFolder, file));

		if (listOfMetadataFiles.length == 0) return [];

		const listOfListOfTags = listOfMetadataFiles.map((file) => fs.readFileSync(file))
			.map((contents) => JSON.parse(contents))
			.map((metadata) => metadata.tags)
			.flat();

		return [...new Set(listOfListOfTags)];
	}

	openSettingsJson() {
		const userData = app.getPath("userData");
		exec(`open "${userData}"`);
	}
}

export const io = new IO();