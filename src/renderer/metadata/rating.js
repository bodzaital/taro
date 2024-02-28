import { $, $$ } from '../utility/shorthand';
import { metadata } from './metadata';

class Rating {
	#radioes = $$("input[name='rating']");

	constructor() {
		this.#radioes.forEach((x) => x.addEventListener("click", () => {
			metadata.setRating(x.value);
		}));

		window.addEventListener("folderLoaded", () => this.#loadFolder());
		window.addEventListener("folderUnloaded", () => this.#unloadFolder());
	}

	getRatingValue() {
		return $("input[name='rating']:checked").value;
	}

	setRatingValue(value) {
		$("input[name='rating']:checked").checked = false;
		$(`input[name='rating'][value='${value}']`).checked = true;
	}

	#loadFolder() {
		this.#radioes.forEach((x) => x.disabled = false);
	}

	#unloadFolder() {
		this.setRatingValue(0);
		this.#radioes.forEach((x) => x.disabled = true);
	}
}

export const rating = new Rating();