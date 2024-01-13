import { dialog, net, protocol } from "electron";
import { CH_CLOSE_FOLDER, CH_LOAD_IMAGES, CH_NO_IMAGES } from "../ipcConstants";
import path from "path";
import { ipc } from "./ipc";
import FolderInfo from "../data/folderInfo";
import fs from "fs";
import Metadata from "../data/metadata";

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