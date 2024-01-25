import { $ } from './shorthand';
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
		exifFocal: $("#sidebarExifFocal"),

		placeholder: null,
	};

	#exifDetailTrigger = $("#exifDetailTrigger");
	#exifDetailPanel = $("#exifDetailPanel");

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

		computePosition(this.#exifDetailTrigger, this.#exifDetailPanel).then(({x, y}) => {
			Object.assign(this.#exifDetailPanel.style, {
				left: `${x}px`,
				top: `${y + 8}px`
			});
		});
	}

	clearExifData() {
		for (const [key, value] of Object.entries(this.#details)) {
			if (key == "placeholder") continue;
			if (key == "exifFloater") continue;

			this.#details[key].innerText = "";
			this.#details[key].appendChild(this.#details.placeholder.cloneNode());
		}
	}

	setExifData(shutter, aperture, iso, model, focal) {
		this.#details.exifShutter.innerText = shutter != null
			? `${shutter}s`
			: "N/A";

		this.#details.exifAperture.innerText = aperture != null
			? `ƒ/${aperture}`
			: "N/A";

		this.#details.exifIso.innerText = iso ?? "N/A";

		this.#details.exifCamera.innerText = model ?? "N/A";

		this.#details.exifFocal.innerText = focal ?? "N/A";
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
				exif.FocalLength.description
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