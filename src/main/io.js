import { dialog, net, protocol } from "electron";
import { CH_CLOSE_FOLDER, CH_LOAD_IMAGES } from "../ipcConstants";
// import { readdirSync } from "original-fs";
// import { raiseEvent } from "./ipc";
import path from "path";
import { ipc } from "./ipc";
import FolderInfo from "../data/folderInfo";
import fs from "fs";
import Metadata from "../data/metadata";

const PROTO_FAB = "fab";
const SUPPORTED_PHOTO_EXTENSIONS = ["jpg"];

/** Registers the fab:// handle by substituting it for the file:// URI path and returning the correct file. */
export function registerFabProtocol() {
	protocol.handle(PROTO_FAB, (request) => {
		return net.fetch("file://" + request.url.slice(`${PROTO_FAB}://`.length));
	});
}

export function openFolderHandler() {
	const folderPath = dialog.showOpenDialogSync({
		properties: ["openDirectory"]
	});

	const listOfImageUris = fs.readdirSync(folderPath[0])
		.filter((file) => file[0] != ".")
		.map((file) => `${folderPath}/${file}`)
		.filter((uri) => !SUPPORTED_PHOTO_EXTENSIONS.includes(path.extname(uri).toLowerCase()));

	if (!fs.existsSync("taro.metadata.json")) {
		fs.writeFileSync("taro.metadata.json", JSON.stringify(new Metadata("hello béla")));
	}

	const folderInfo = new FolderInfo(folderPath, listOfImageUris);

	ipc.raise(CH_LOAD_IMAGES, [folderInfo]);
}

export function closeFolderHandler() {
	ipc.raise(CH_CLOSE_FOLDER);
}