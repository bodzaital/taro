import { folder } from "../folder";

class Suggestions {
	constructor() {
	}
	
	getSuggestions(value = null) {
		window.ipc.getAllTags(folder.folderInfo.folderPath).then((tags) => {
			tags = tags.filter((x) => x.includes(value)).slice(0, 3);

			if (value == null) {
				// TODO: maybe randomize (not typed in anything).
				tags = tags.slice(0, 3);
			}

			console.log(tags);
		});
	}
}

export const suggestions = new Suggestions();