export default class Control {
	#elementName = null;
	#classList = [];
	#dataset = [];
	#properties = [];
	#children = [];
	#innerText = "";

	// TODO: convert element creation to using this class.

	constructor(elementName) {
		this.#elementName = elementName;
	}

	class(...classList) {
		classList.forEach((e) => this.#classList.push(e));
		return this;
	}
	
	data(key, value) {
		this.#dataset.push({
			"key": key,
			"value": value
		});
		return this;
	}

	text(value) {
		this.#innerText = value;
		return this;
	}
	
	add(key, value) {
		this.#properties.push({
			"key": key,
			"value": value
		});
		return this;
	}
	
	child(element) {
		this.#children.push(element);
		return this;
	}

	get() {
		const element = document.createElement(this.#elementName);

		element.innerText = this.#innerText;

		this.#classList.forEach((e) => {
			element.classList.add(e);
		});

		this.#dataset.forEach((data) => {
			element.dataset[data.key] = data.value;
		});

		this.#properties.forEach((property) => {
			element.setAttribute(property.key, property.value);
		});

		this.#children.forEach((child) => {
			element.appendChild(child);
		});

		return element;
	}
}