import { folder } from "../folder";

class Suggestions {
	constructor() {
	}
	
	getSuggestions(value = null) {
		window.ipc.getAllTags(folder.folderInfo.folderPath).then((tags) => {
			tags = tags.filter((x) => x.includes(value)).slice(0, 3);

			if (value == null) {
				tags = tags.slice(0, 3);
			}

			console.log(tags);
		});
	}
}

export const suggestions = new Suggestions();