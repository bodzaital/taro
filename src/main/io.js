import { dialog, net, protocol } from "electron";
import { CH_CLOSE_FOLDER, CH_LOAD_IMAGES } from "../ipcConstants";
import { readdirSync } from "original-fs";
import { raiseEvent } from "./ipc";

const PROTO_FAB = "fab";

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

	const listOfImageUris = readdirSync(folderPath[0])
		.map((uri) => `${folderPath}/${uri}`);

	raiseEvent(CH_LOAD_IMAGES, listOfImageUris);
}

export function closeFolderHandler() {
	raiseEvent(CH_CLOSE_FOLDER);
}