import Control from "../control";
import { i18n } from "../i18n";
import { $ } from "../shorthand";

class EXIF {
	#placeholder = null;

	#controls = {
		shutter: $("#sidebarExifShutter"),
		aperture: $("#sidebarExifAperture"),
		iso: $("#sidebarExifIso"),
		focalLength: $("#sidebarExifFocalLength"),
		exposure: $("#sidebarExifExposureMode"),
		cameraModel: $("#sidebarExifCamera"),
		dateOnly: $("#sidebarExifDate"),
	};

	#tooltips = {
		lensModel: null,
		timeOnly: null,
	};

	constructor() {
		this.#placeholder = new Control("div")
			.class("placeholder")
			.style("width", "100%")
			.get();

		this.#tooltips.timeOnly = new bootstrap.Tooltip($("#sidebarExifDateTime"));
		this.#tooltips.lensModel = new bootstrap.Tooltip($("#sidebarExifLensModel"));

		window.addEventListener("folderLoaded", () => this.loadFolder());
		window.addEventListener("folderUnloaded", () => this.unloadFolder());
	}

	setData(shutter, aperture, iso, model, focalLength, dateTime, lensModel, exposure) {
		this.#controls.shutter.innerText = shutter != null
			? `${shutter}s`
			: "N/A";

		this.#controls.aperture.innerText = aperture != null
			? `ƒ/${aperture}`
			: "N/A";

		this.#controls.iso.innerText = iso ?? "N/A";

		this.#controls.cameraModel.innerText = model ?? "N/A";
		this.#tooltips.lensModel.setContent({ ".tooltip-inner": lensModel ?? "N/A" });

		this.#controls.focalLength.innerText = focalLength ?? "N/A";

		this.#controls.dateOnly.innerText = dateTime != null
			? dateTime.substring(0, 10).replaceAll(":", "-")
			: "N/A";

		const timeOnly = dateTime != null
			? dateTime.substring(dateTime.indexOf(" "))
			: "N/A";

		this.#tooltips.timeOnly.setContent({ ".tooltip-inner": timeOnly ?? "N/A" });

		this.#controls.exposure.innerText = exposure ?? "N/A";
	}

	clearData() {
		for (const [key, value] of Object.entries(this.#controls)) {
			this.#controls[key].innerText = "";
			this.#controls[key].appendChild(this.#placeholder.cloneNode());
		}

		i18n.register("sidebar.tooltip.unknownDateAndTime", (text) => {
			this.#tooltips.timeOnly.setContent({ ".tooltip-inner": text });
		}, () => {
			this.#tooltips.timeOnly.setContent({ ".tooltip-inner": "Unknown date and time" });
		});

		i18n.register("sidebar.tooltip.unknownLensModel", (text) => {
			this.#tooltips.lensModel.setContent({ ".tooltip-inner": text });
		}, () => {
			this.#tooltips.lensModel.setContent({ ".tooltip-inner": "Unknown lens model" });
		});
	}

	loadFolder() {

	}

	unloadFolder() {
		this.clearData();
	}
}

export const exif = new EXIF();