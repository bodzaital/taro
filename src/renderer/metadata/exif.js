import { Tooltip } from "bootstrap";
import Control from "../control";
import { i18n } from "../i18n";
import { $ } from "../utility/shorthand";

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

		this.#tooltips.timeOnly = new Tooltip($("#sidebarExifDateTime"));
		this.#tooltips.lensModel = new Tooltip($("#sidebarExifLensModel"));

		window.addEventListener("folderLoaded", () => this.loadFolder());
		window.addEventListener("folderUnloaded", () => this.unloadFolder());
	}

	loadData(uri) {
		this.#clearData();

		window.invoke.getExif(uri).then((data) => {
			this.#setData(
				data.ExposureTime?.description,
				data.FNumber,
				data.ISOSpeedRatings?.description,
				data.Model?.description,
				data.FocalLength?.description,
				data.DateTime?.description,
				data.LensModel?.description,
				data.ExposureProgram?.description
			);
		});
	}

	#setData(shutter, aperture, iso, model, focalLength, dateTime, lensModel, exposure) {
		this.#controls.shutter.innerText = shutter != null
			? `${shutter}s`
			: "N/A";

		const fnumber = aperture != null
			? aperture?.value[0] / aperture?.value[1]
			: null;

		this.#controls.aperture.innerText = fnumber != null
			? `ƒ/${fnumber}`
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

	#clearData() {
		for (const [key, value] of Object.entries(this.#controls)) {
			this.#controls[key].innerText = "";
			this.#controls[key].appendChild(this.#placeholder.cloneNode());
		}

		i18n.push("sidebar.tooltip.unknownDateAndTime",	"Unknown date and time", (text) => {
			this.#tooltips.timeOnly.setContent({ ".tooltip-inner": text });
		});

		i18n.push("sidebar.tooltip.unknownLensModel", "Unknown lens model", (text) => {
			this.#tooltips.lensModel.setContent({ ".tooltip-inner": text });
		});
	}

	loadFolder() {

	}

	unloadFolder() {
		this.#clearData();
	}
}

export const exif = new EXIF();