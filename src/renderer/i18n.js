import { $, $$ } from "./shorthand";

class Internationalization {
	#knownLanguages = [
		"en",
		"hu",
	];

	constructor() {
		
	}

	changeLanguage(targetLanguage) {
		if (!this.#knownLanguages.includes(targetLanguage)) targetLanguage = "en";

		import(`../data/i18n/${targetLanguage}.json`)
			.then((data) => data.resources)
			.then((resources) => this.#refresh(resources));
	}

	#refresh(resources) {
		const elements = $$("[data-i18n]");

		elements.forEach((element) => {
			element.innerText = this.#resolve(element.dataset.i18n, resources);
		});
	}

	/** Resolves the value of a path of keys in an object. Source: https://stackoverflow.com/a/45322101 */
	#resolve(path, object) {
		return path.split(".").reduce((a, c) => {
			return a ? a[c] : null;
		}, object || self);
	}
}

export const i18n = new Internationalization();