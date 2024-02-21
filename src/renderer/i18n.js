import { AppSettingsConstant } from "../data/appsettingsConstants";
import { $, $$ } from "./shorthand";

class Internationalization {
	#knownLanguages = [
		"en",
		"hu",
	];

	constructor() {
		window.listen.applySetting((key, value) => this.#applySetting(key, value));
		// import("../data/i18n/en.json")
		// 	.then((data) => data.resources)
		// 	.then((resources) => this.#refresh(resources));
	}

	changeLanguage(targetLanguage) {
		if (!this.#knownLanguages.includes(targetLanguage)) targetLanguage = "en";

		import(`../data/i18n/${targetLanguage}.json`)
			.then((data) => data.resources)
			.then((resources) => this.#refresh(resources));
	}

	#applySetting(key, value) {
		if (key == AppSettingsConstant.LANGUAGE) this.changeLanguage(value);
	}

	#refresh(resources) {
		const elements = Array.from($$("[data-i18n]"));

		elements.forEach((element) => {
			const text = this.#resolve(element.dataset.i18n, resources);

			this.#set(text, element);
		});
	}

	/** Resolves the value of a path of keys in an object. Source: https://stackoverflow.com/a/45322101 */
	#resolve(path, object) {
		return path.split(".").reduce((a, c) => {
			return a ? a[c] : null;
		}, object || self);
	}

	#set(text, element) {
		if (text == undefined) return;

		if (element.dataset.i18nTarget) {
			element[element.dataset.i18nTarget] = text;
		} else {
			element.innerText = text;
		}
	}
}

export const i18n = new Internationalization();