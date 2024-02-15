import { AppSettingsConstant } from '../data/appsettingsConstants';
import Control from './control';
import { folder } from './folder';
import { description } from './metadata/description';
import { location } from './metadata/location';
import { rating } from './metadata/rating';
import { tagging } from './metadata/tagging';
import { exif } from "./metadata/exif";
import { $, $$ } from './shorthand';

class Sidebar {
	#sidebarToggleButton = $("#sidebarToggleButton");
	#viewer = $(".viewer");
	#isSidebarOpen = true;
	metadata = null;

	photoName = $("#photo-name");

	constructor() {
		
		this.#sidebarToggleButton.addEventListener("click", () => {
			this.toggleSidebar(!this.#isSidebarOpen);
			
			window.invoke.saveSetting("isSidebarVisible", this.#isSidebarOpen);
		});

		window.addEventListener("folderLoaded", () => {
			this.loadFolder();
		});

		window.addEventListener("folderUnloaded", () => {
			this.unloadFolder();
		});

		window.listen.applySetting((key, value) => {
			if (key == AppSettingsConstant.SIDEBAR_VISIBLE) this.toggleSidebar(value);
			if (key == AppSettingsConstant.SIDEBAR_POSITION) this.changePosition(value);
		});
	}

	toggleSidebar(state) {
		this.#isSidebarOpen = state;

		if (this.#isSidebarOpen) {
			this.#viewer.classList.remove("no-sidebar");
			this.#sidebarToggleButton.classList.add("active");
		} else {
			this.#viewer.classList.add("no-sidebar");
			this.#sidebarToggleButton.classList.remove("active");
		}
	}

	changePosition(value) {
		if (value == "left") {
			this.#viewer.classList.add("left-sidebar");
		} else {
			this.#viewer.classList.remove("left-sidebar");
		}
	}

	loadExifData(uri) {
		exif.clearData();

		window.invoke.getExif(uri).then((data) => {
			const fnumber = data.FNumber != null
				? data.FNumber?.value[0] / data.FNumber?.value[1]
				: null;

			exif.setData(
				data.ExposureTime?.description,
				fnumber,
				data.ISOSpeedRatings?.description,
				data.Model?.description,
				data.FocalLength?.description,
				data.DateTime?.description,
				data.LensModel?.description,
				data.ExposureProgram?.description
			);
		});
	}

	loadMetadata(photo) {
		window.invoke.getMetadata(folder.folderInfo.folderPath, photo).then((metadata) => {
			this.metadata = metadata;
			console.log("Loaded metadata:", this.metadata);

			rating.setRatingValue(this.metadata.rating);
			description.setDescriptionValue(this.metadata.description);
			tagging.createTags(...this.metadata.tags);
			location.setLocationValue(this.metadata.location);
		});
	}

	writeMetadata() {
		window.invoke.writeMetadata(folder.folderInfo.folderPath, this.metadata);
	}

	loadFolder() {
	}

	unloadFolder() {
		this.photoName.innerText = "No image";
	}
}

export const sidebar = new Sidebar();