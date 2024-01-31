import { Menu, app, dialog, net, protocol } from "electron";
import { CH_CLOSE_FOLDER, CH_LOAD_IMAGES, CH_NO_IMAGES, CH_OPEN_CANCELED, CH_SHOW_ALERT } from "../ipcConstants";
import path from "path";
import { ipc } from "./ipc";
import FolderInfo from "../data/folderInfo";
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
			ipc.raise(CH_SHOW_ALERT, ["Opening a folder is canceled.", "info"]);
			return;
		}

		this.#folderPath = folderPath;

		const listOfImageURIs = this.#getListOfImageURIs(folderPath);
		
		if (listOfImageURIs.length == 0) {
			ipc.raise(CH_SHOW_ALERT, ["There are no images in this folder.", "warning"]);
			return;
		}
		
		Menu.getApplicationMenu().getMenuItemById("file/close-folder").enabled = true;
		Menu.getApplicationMenu().getMenuItemById("file/reveal-folder").enabled = true;

		const baseName = path.basename(folderPath);
		ipc.raise(CH_LOAD_IMAGES, [new FolderInfo(folderPath, baseName, listOfImageURIs)]);
	}
	
	closeFolderHandler() {
		Menu.getApplicationMenu().getMenuItemById("file/close-folder").enabled = false;
		Menu.getApplicationMenu().getMenuItemById("file/reveal-folder").enabled = false;
		this.#folderPath = null;
		ipc.raise(CH_CLOSE_FOLDER);
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

	#ensureMetadataFileExists(folderPath) {
		const taroMetadataPath = path.join(folderPath, IO.TARO_METADATA_FILENAME);

		if (fs.existsSync(taroMetadataPath)) {
			return;
		}

		// TODO: create actual empty metadata.
		// fs.writeFileSync(taroMetadataPath, JSON.stringify(new Metadata("hello")));
	}
}

export const io = new IO();