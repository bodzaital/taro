import { $, $$ } from '../shorthand';
import { sidebar } from '../sidebar';

class Rating {
	constructor() {
		$$("input[name='rating']").forEach((x) => x.addEventListener("click", () => {
			sidebar.metadata.rating = x.value;
			sidebar.writeMetadata()
		}));
	}

	getRatingValue() {
		return $("input[name='rating']:checked").value;
	}

	setRatingValue(value) {
		$("input[name='rating']:checked").checked = false;
		$(`input[name='rating'][value='${value}']`).checked = true;
	}
}

export const rating = new Rating();