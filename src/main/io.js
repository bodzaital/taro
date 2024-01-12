import { dialog, net, protocol } from "electron";
import { CH_CLOSE_FOLDER, CH_LOAD_IMAGES, CH_NO_IMAGES } from "../ipcConstants";
// import { readdirSync } from "original-fs";
// import { raiseEvent } from "./ipc";
import path from "path";
import { ipc } from "./ipc";
import FolderInfo from "../data/folderInfo";
import fs from "fs";
import Metadata from "../data/metadata";

const TARO_HANDLE = "taro";
// const SUPPORTED_PHOTO_EXTENSIONS = ["jpg"];

// TODO: refactor to use new class

// /** Registers the taro:// handle by substituting it for the file:// URI path and returning the correct file. */
// export function registerTaroProtocol() {
// 	protocol.handle(TARO_HANDLE, (request) => {
// 		return net.fetch("file://" + request.url.slice(`${TARO_HANDLE}://`.length));
// 	});
// }

// export function openFolderHandler() {
// 	const folderPath = dialog.showOpenDialogSync({
// 		properties: ["openDirectory"]
// 	})[0];

// 	const listOfImageUris = fs.readdirSync(folderPath)
// 		.filter((file) => file[0] != ".")
// 		.map((file) => `${folderPath}/${file}`)
// 		.filter((uri) => !SUPPORTED_PHOTO_EXTENSIONS.includes(path.extname(uri).toLowerCase()));

// 	const metadataPath = path.join(folderPath, "taro.metadata.json");
// 	console.log(metadataPath);

// 	if (!fs.existsSync(metadataPath)) {
// 		fs.writeFileSync(metadataPath, JSON.stringify(new Metadata("hello béla")));
// 	}

// 	const folderInfo = new FolderInfo(folderPath, listOfImageUris);

// 	ipc.raise(CH_LOAD_IMAGES, [folderInfo]);
// }

// export function closeFolderHandler() {
// 	ipc.raise(CH_CLOSE_FOLDER);
// }

class IO {
	static TARO_METADATA_FILENAME = "taro.metadata.json";
	static SUPPORTED_PHOTO_EXTENSIONS = [".jpg"];

	registerTaroProtocol() {
		protocol.handle(TARO_HANDLE, (request) => {
			const fileProto = "file://";
			const taroProto = TARO_HANDLE + "://";
			const rawUri = request.url.slice(taroProto.length);

			return net.fetch(fileProto + rawUri);
		});
	}

	openFolderHandler() {
		const folderPath = this.#getFolderPathFromDialog();
		const listOfImageURIs = this.#getListOfImageURIs(folderPath);
		
		
		if (listOfImageURIs.length == 0) {
			ipc.raise(CH_NO_IMAGES);
			return;
		}
		
		this.#ensureMetadataFileExists(folderPath);
		
		ipc.raise(CH_LOAD_IMAGES, [new FolderInfo(folderPath, listOfImageURIs)]);
	}
	
	closeFolderHandler() {
		ipc.raise(CH_CLOSE_FOLDER);
	}
	
	#getFolderPathFromDialog() {
		const selectedFolderPaths = dialog.showOpenDialogSync({
			properties: ["openDirectory"]
		});
		
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