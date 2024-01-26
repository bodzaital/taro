import { $, $$ } from './shorthand';
import { computePosition } from '@floating-ui/dom';

class Sidebar {
	#sidebarToggleButton = $("#sidebarToggleButton");
	#viewer = $(".viewer");
	#isSidebarOpen = true;
	photoName = $("#photo-name");

	#details = {
		exifShutter: $("#sidebarExifShutter"),
		exifAperture: $("#sidebarExifAperture"),
		exifIso: $("#sidebarExifIso"),
		exifCamera: $("#sidebarExifCamera"),
		exifFocal: $("#sidebarExifFocalLength"),
		exifDate: $("#sidebarExifDate"),

		placeholder: null,
	};

	#exifDateTimeTooltip = null;

	constructor() {
		this.#details.placeholder = document.createElement("div");
		this.#details.placeholder.classList.add("placeholder");
		this.#details.placeholder.style.width = "100%";
		
		this.#sidebarToggleButton.addEventListener("click", () => {
			this.#isSidebarOpen = !this.#isSidebarOpen;

			if (this.#isSidebarOpen) {
				this.#viewer.classList.remove("no-sidebar");
				this.#sidebarToggleButton.classList.add("active");
			} else {
				this.#viewer.classList.add("no-sidebar");
				this.#sidebarToggleButton.classList.remove("active");
			}
		});

		this.#exifDateTimeTooltip = new bootstrap.Tooltip($("#sidebarExifDateTime"));
	}

	clearExifData() {
		for (const [key, value] of Object.entries(this.#details)) {
			if (key == "placeholder") continue;
			if (key == "exifFloater") continue;

			this.#details[key].innerText = "";
			this.#details[key].appendChild(this.#details.placeholder.cloneNode());
		}
	}

	setExifData(shutter, aperture, iso, model, focal, dateTime) {
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
			? dateTime.replace(":", "-").replace(":", "-")
			: null;

		this.#details.exifDate.innerText = dateOnly ?? "N/A";
		this.#exifDateTimeTooltip.setContent({ ".tooltip-inner": dateTime ?? "N/A" });
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
				exif.DateTime?.description
			);
		});
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