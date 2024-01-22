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

	/** Add a list of strings to the classlist of this element. */
	class(...classList) {
		classList.forEach((e) => this.#classList.push(e));
		return this;
	}
	
	/** Add a key-value pair to the dataset of this element. */
	data(key, value) {
		this.#dataset.push({
			"key": key,
			"value": value
		});
		return this;
	}

	/** Add a string to the innerText of this element. */
	text(value) {
		this.#innerText = value;
		return this;
	}
	
	/** Add a key-value pair as any property to this element. */
	add(key, value) {
		this.#properties.push({
			"key": key,
			"value": value
		});
		return this;
	}
	
	/** Add a child element. */
	child(element) {
		this.#children.push(element);
		return this;
	}

	/** Create a DOM object from this builder. */
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