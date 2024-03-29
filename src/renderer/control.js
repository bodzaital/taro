export default class Control {
	#name = null;
	#id = null;
	#classList = [];
	#dataset = [];
	#properties = [];
	#innerText = "";
	#styles = [];
	#html = null;
	
	children = [];

	constructor(elementName) {
		this.#name = elementName;
	}

	/** Adds an ID to this element. */
	id(value) {
		this.#id = value;
		return this;
	}

	/** Sets the raw HTML contents of this element. */
	html(value) {
		this.#html = value;
		return this;
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

	/** Add a key-value pair as CSS style. */
	style(key, value) {
		this.#styles.push({
			"key": key,
			"value": value
		});
		return this;
	}
	
	/** Add a child element. The child must be a builder Control. */
	child(element) {
		this.children.push(element);
		return this;
	}

	/** Create a DOM object from this builder. */
	get() {
		const element = document.createElement(this.#name);

		element.innerText = this.#innerText;

		if (this.#id != null) element.id = this.#id;

		this.#classList.forEach((e) => {
			element.classList.add(e);
		});

		this.#dataset.forEach((data) => {
			element.dataset[data.key] = data.value;
		});

		this.#properties.forEach((property) => {
			element.setAttribute(property.key, property.value);
		});

		this.children.forEach((child) => {
			if (typeof child.get !== "function") {
				console.error(child, this);
				throw new Error(`The child is not a Control.`);
			}

			element.appendChild(child.get());
		});

		element.style = this.#styles.map((style) => `${style.key}:${style.value}`).join(";");

		if (this.#html != null) element.innerHTML = this.#html;

		return element;
	}
}