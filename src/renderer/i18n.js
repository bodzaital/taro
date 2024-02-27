import { AppSettingsConstant } from "../data/appsettingsConstants";
import { $, $$ } from "./shorthand";

class Internationalization {
	static KNOWN_LANGUAGES = [ "en", "hu" ];

	#languageResources = null;
	#registeredCallbacks = [];

	constructor() {
		window.listen.applySetting((key, value) => this.#applySetting(key, value));
	}

	/** Pulls a resource text by the given key. If the key is not found, returns the default text. */
	pull(key, defaultText) {
		const text = this.#resolveKeyPath(key, this.#languageResources);

		return text != undefined
			? text
			: defaultText;
	}

	/** Pushes a resource text by the given key once the language resources are ready. If the key is
	 * not found, returns the default text. */
	push(key, defaultText, callback) {
		if (this.#languageResources != null) {
			callback(this.get(key, defaultText));
			return;
		}

		if (this.#registeredCallbacks.filter((x) => x.key == key).length != 0) {
			return;
		}

		this.#registeredCallbacks.push({
			"key": key,
			"defaultText": defaultText,
			"callback": callback,
		});
	}

	#applySetting(key, value) {
		if (key == AppSettingsConstant.LANGUAGE) this.#changeLanguage(value);
	}

	#changeLanguage(targetLanguage) {
		if (!Internationalization.KNOWN_LANGUAGES.includes(targetLanguage)) targetLanguage = "en";

		import(`../data/i18n/${targetLanguage}.json`)
			.then((data) => this.#cacheLanguageResources(data))
			.then(() => this.#reloadTextOnGUI());
	}

	#cacheLanguageResources(data) {
		this.#languageResources = data.resources;
	}

	#reloadTextOnGUI() {
		this.#registeredCallbacks.forEach((registeredCallback) => {
			registeredCallback.callback(this.get(registeredCallback.key, registeredCallback.defaultText));
		});

		Array.from($$("[data-i18n]")).forEach((element) => {
			const text = this.#resolveKeyPath(element.dataset.i18n, this.#languageResources);
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
}

export const i18n = new Internationalization();