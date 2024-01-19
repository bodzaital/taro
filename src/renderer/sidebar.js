import { $ } from './shorthand';

class Sidebar {
	#sidebarToggleButton = $("#sidebarToggleButton");
	#viewer = $(".viewer");
	#isSidebarOpen = true;
	photoName = $("#photo-name");

	#details = {
		exifShutter: $("#sidebarExifShutter"),
		exifAperture: $("#sidebarExifAperture"),
		exifIso: $("#sidebarExifIso"),
		placeholder: null,
	};

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
	}

	clearExifData() {
		this.#details.exifShutter.innerText = "";
		this.#details.exifAperture.innerText = "";
		this.#details.exifIso.innerText = "";

		this.#details.exifShutter.appendChild(this.#details.placeholder.cloneNode());
		this.#details.exifAperture.appendChild(this.#details.placeholder.cloneNode());
		this.#details.exifIso.appendChild(this.#details.placeholder.cloneNode());
	}

	setExifData(shutter, aperture, iso) {
		this.#details.exifShutter.innerText = `${shutter}s`;
		this.#details.exifAperture.innerText = `ƒ/${aperture}`;
		this.#details.exifIso.innerText = iso;
	}

	loadExifData(uri) {
		this.clearExifData();

		window.ipc.getExif(uri).then((exif) => {
			const fnumber = exif.FNumber.value[0] / exif.FNumber.value[1];
			this.setExifData(
				exif.ShutterSpeedValue.description,
				fnumber,
				exif.ISOSpeedRatings.description
			);
			
			console.log(exif);
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