import { $ } from "./shorthand";

class Support {
	#tabConainer = $("#supportTabs");
	#tabs = [];

	constructor() {
		Array.from(this.#tabConainer.children).forEach((x) => {
			this.#tabs.push(x);
		});

		this.#tabs.forEach((x) => x.addEventListener("click", () => {
			const clickedPageId = x.dataset.target;
			const currentPageId = this.#getActivePageId();
			
			if (clickedPageId == currentPageId) return;

			this.#changePage(currentPageId, clickedPageId);
		}));
	}

	#getActivePageId() {
		return this.#tabs.filter((x) => x.classList.contains("btn-primary"))[0].dataset.target;
	}

	#changePage(fromId, toid) {
		$(fromId).classList.remove("visible");
		$(toid).classList.add("visible");

		this.#getTabByTargetId(fromId).classList.toggle("btn-primary");
		this.#getTabByTargetId(fromId).classList.toggle("btn-outline-primary");

		this.#getTabByTargetId(toid).classList.toggle("btn-primary");
		this.#getTabByTargetId(toid).classList.toggle("btn-outline-primary");
	}

	#getTabByTargetId(id) {
		return $(`#supportTabs [data-target='${id}']`);
	}
}

export const support = new Support();