import { $ } from './shorthand';

class Sidebar {
	#sidebarToggleButton = $("#sidebarToggleButton");
	#viewer = $(".viewer");
	#isSidebarOpen = true;

	constructor() {
		this.#sidebarToggleButton.addEventListener("click", () => {
			this.#isSidebarOpen = !this.#isSidebarOpen;

			if (this.#isSidebarOpen) {
				this.#viewer.classList.remove("no-sidebar");
				this.#sidebarToggleButton.classList.add("active");
			} else {
				this.#viewer.classList.add("no-sidebar");
				this.#sidebarToggleButton.classList.remove("active");
			}
		});
	}
}

export const sidebar = new Sidebar();