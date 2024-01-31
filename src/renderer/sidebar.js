import { folder } from './folder';
import { description } from './metadata/description';
import { rating } from './metadata/rating';
import { $, $$ } from './shorthand';

class Sidebar {
	#sidebarToggleButton = $("#sidebarToggleButton");
	#viewer = $(".viewer");
	#isSidebarOpen = true;
	metadata = null;

	photoName = $("#photo-name");

	#details = {
		exifShutter: $("#sidebarExifShutter"),
		exifAperture: $("#sidebarExifAperture"),
		exifIso: $("#sidebarExifIso"),
		exifCamera: $("#sidebarExifCamera"),
		exifFocal: $("#sidebarExifFocalLength"),
		exifDate: $("#sidebarExifDate"),
		exifExposure: $("#sidebarExifExposureMode"),

		placeholder: null,
	};

	#exifDateTimeTooltip = null;
	#exifLensModelTooltip = null;

	constructor() {
		this.#details.placeholder = document.createElement("div");
		this.#details.placeholder.classList.add("placeholder");
		this.#details.placeholder.style.width = "100%";
		
		this.#sidebarToggleButton.addEventListener("click", () => {
			this.toggleSidebar(!this.#isSidebarOpen);
			
			window.ipc.saveSetting("isSidebarVisible", this.#isSidebarOpen);
		});

		this.#exifDateTimeTooltip = new bootstrap.Tooltip($("#sidebarExifDateTime"));
		this.#exifLensModelTooltip = new bootstrap.Tooltip($("#sidebarExifLensModel"));

		rating.setRatingValue(0);
		description.setDescriptionValue("");

		this.clearExifData();

		window.addEventListener("folderLoaded", () => {
			this.loadFolder();
		});

		window.addEventListener("folderUnloaded", () => {
			this.unloadFolder();
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

	clearExifData() {
		for (const [key, value] of Object.entries(this.#details)) {
			if (key == "placeholder") continue;
			if (key == "exifFloater") continue;

			this.#details[key].innerText = "";
			this.#details[key].appendChild(this.#details.placeholder.cloneNode());
		}

		this.#exifDateTimeTooltip.setContent({ ".tooltip-inner": "Unknown date or time" });
		this.#exifLensModelTooltip.setContent({ ".tooltip-inner": "Unknown lens" });
	}

	setExifData(shutter, aperture, iso, model, focal, dateTime, lensModel, exposure) {
		this.#details.exifShutter.innerText = shutter != null
			? `${shutter}s`
			: "N/A";

		this.#details.exifAperture.innerText = aperture != null
			? `ƒ/${aperture}`
			: "N/A";

		this.#details.exifIso.innerText = iso ?? "N/A";

		this.#details.exifCamera.innerText = model ?? "N/A";

		this.#details.exifFocal.innerText = focal ?? "N/A";

		const dateOnly = dateTime != null
			? dateTime.substring(0, 10).replaceAll(":", "-")
			: null;

		dateTime = dateTime != null
			? dateTime.substring(dateTime.indexOf(" "))
			: null;

		this.#details.exifDate.innerText = dateOnly ?? "N/A";

		this.#details.exifExposure.innerText = exposure ?? "N/A";

		this.#exifDateTimeTooltip.setContent({ ".tooltip-inner": dateTime ?? "N/A" });

		this.#exifLensModelTooltip.setContent({ ".tooltip-inner": lensModel ?? "N/A" })
	}

	loadExifData(uri) {
		this.clearExifData();

		window.ipc.getExif(uri).then((exif) => {
			const fnumber = exif.FNumber != null
				? exif.FNumber?.value[0] / exif.FNumber?.value[1]
				: null;

			console.log(exif);

			this.setExifData(
				exif.ExposureTime?.description,
				fnumber,
				exif.ISOSpeedRatings?.description,
				exif.Model?.description,
				exif.FocalLength?.description,
				exif.DateTime?.description,
				exif.LensModel?.description,
				exif.ExposureProgram?.description
			);
		});
	}

	loadMetadata(photo) {
		window.ipc.getMetadata(folder.folderInfo.folderPath, photo).then((metadata) => {
			this.metadata = metadata;
			console.log("Loaded metadata:", this.metadata);

			rating.setRatingValue(this.metadata.rating);
			description.setDescriptionValue(this.metadata.description);
		});
	}

	writeMetadata() {
		window.ipc.writeMetadata(folder.folderInfo.folderPath, this.metadata);
	}

	/** Calls the necessary instance functions when a folder is loaded. */
	loadFolder() {
	}

	/** Calls the necessary instance functions when a folder is unloaded. */
	unloadFolder() {
		this.clearExifData();
		this.photoName.innerText = "No image";
	}
}

export const sidebar = new Sidebar();