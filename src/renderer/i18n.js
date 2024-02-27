import { AppSettingsConstant } from "../data/appsettingsConstants";
import { $, $$ } from "./shorthand";

class Internationalization {
	#knownLanguages = [
		"en",
		"hu",
	];

	#resources = null;
	#callbacks = [];

	constructor() {
		window.listen.applySetting((key, value) => this.#applySetting(key, value));
	}

	/** Registers a promise to when the language file is loaded. If the supplied
	 * key is not found, the promise is rejected. */
	register(key, resolve, reject) {
		this.#callbacks = this.#callbacks.filter((x) => x.key != key);

		this.#callbacks.push({
			"key": key,
			"resolve": resolve,
			"reject": reject
		});
	}

	#changeLanguage(targetLanguage) {
		if (!this.#knownLanguages.includes(targetLanguage)) targetLanguage = "en";

		import(`../data/i18n/${targetLanguage}.json`)
			.then((data) => this.#cache(data))
			.then(() => this.#reload());
	}

	#cache(data) {
		this.#resources = data.resources;
	}

	#applySetting(key, value) {
		if (key == AppSettingsConstant.LANGUAGE) this.#changeLanguage(value);
	}

	#reload() {
		this.#callbacks.forEach((callback) => {
			const text = this.#resolveKeyPath(callback.key, this.#resources);
			this.#setCallbackValue(text, callback);
		});

		Array.from($$("[data-i18n]")).forEach((element) => {
			const text = this.#resolveKeyPath(element.dataset.i18n, this.#resources);
			this.#setElementValue(text, element);
		});
	}

	/** Resolves the value of a path of keys in an object. Source: https://stackoverflow.com/a/45322101 */
	#resolveKeyPath(path, object) {
		return path.split(".").reduce((a, c) => {
			return a ? a[c] : null;
		}, object || self);
	}

	#setElementValue(text, element) {
		if (text == undefined) return;

		if (element.dataset.i18nTarget) {
			element[element.dataset.i18nTarget] = text;
		} else {
			element.innerText = text;
		}
	}

	#setCallbackValue(text, callback) {
		if (text == undefined) {
			callback.reject();
			return;
		}

		callback.resolve(text);
	}
}

export const i18n = new Internationalization();