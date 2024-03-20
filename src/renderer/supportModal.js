import Showdown from "showdown";
import { $ } from "./utility/shorthand";
import Control from "./control";

class Support {
	#tabConainer = $("#supportTabs");
	#tabs = [];

	constructor() {
		this.#loadText();

		Array.from(this.#tabConainer.children).forEach((x) => {
			this.#tabs.push(x);
		});

		this.#tabs.forEach((x) => x.addEventListener("click", () => {
			const clickedPageId = x.dataset.target;
			const currentPageId = this.#getActivePageId();
			
			if (clickedPageId == currentPageId) return;

			this.#changePage(currentPageId, clickedPageId);
		}));

		this.#changePage(this.#tabs[0].dataset.target, this.#tabs[0].dataset.target);
	}

	#getActivePageId() {
		return this.#tabs.filter((tab) => tab.querySelector("a.nav-link").classList.contains("active"))[0].dataset.target;
	}

	#changePage(fromId, toid) {
		$(fromId).classList.remove("visible");
		$(toid).classList.add("visible");

		this.#getTabByTargetId(fromId).classList.toggle("active");
		this.#getTabByTargetId(toid).classList.toggle("active");
	}

	#getTabByTargetId(id) {
		return $(`#supportTabs [data-target='${id}'] a.nav-link`);
	}

	#loadText() {
		const supportContents = {
			tabs: [
				{
					id: "supportShortcuts",
					pillText: "Shortcuts",
					title: "Keyboard Shortcuts",
					contents: `
- <kbd>⌘O</kbd> &middot; Open folder
- <kbd>⌘W</kbd> &middot; Close folder
- <kbd>⌘Q</kbd> &middot; Quit app
- <kbd>⌥⌘R</kbd> &middot; Reveal folder in Finder
- <kbd>⌥⌘L</kbd> &middot; Toggle dark mode
- <kbd>⌘X</kbd> &middot; Toggle thumbnails
- <kbd>⌘B</kbd> &middot; Toggle sidebar
- <kbd>⌘F</kbd> &middot; Toggle full screen
- <kbd>F12</kbd> &middot; (Debug) Open developer tools`,
				},
				{
					id: "supportEXIF",
					pillText: "EXIF",
					title: "EXIF data",
					contents: `
When opening a photo, the app will open its EXIF information embedded in the file. It tries to load the following values:

- Shutter speed in seconds (or fractions of a second)
- Aperture value in F-Number
- ISO
- Focal length in milimeters
- Date and time the photo was shot
- Exposure mode
- Camera and lens model

Right now, the EXIF data is tested against Canon cameras and lenses, so some or all data may be missing from other manufacturers.`,
				},
				{
					id: "supportTagging",
					pillText: "Tagging",
					title: "Tagging",
					contents: `
When tagging a photo, the app will suggest tags you have used previously in that folder.

A photo cannot be tagged by a duplicate tag.`,
				},
				{
					id: "supportRating",
					pillText: "Rating",
					title: "Rating",
					contents: `
You can rate a photo by giving it a thumbs up or a thumbs down.`,
				},
				{
					id: "supportLocation",
					pillText: "Location",
					title: "Location Information",
					contents: `
You can assign a location tag to a photo, separate from the rest of the tags.`,
				},
				{
					id: "supportDescription",
					pillText: "Description",
					title: "Description",
					contents: `
You can add a longer description to a photo in the description field.`,
				},
			],
		};

		const nav = this.#createNav(supportContents.tabs);
		const pages = this.#createPages(supportContents.tabs);

		pages.forEach((page) => $(".support-pages").appendChild(page));
		nav.forEach((n) => this.#tabConainer.appendChild(n));
	}

	#createNav(pages) {
		const nav = pages.map((page) => new Control("li")
			.data("target", `#${page.id}`)
			.class("nav-item")
			.child(
				new Control("a")
				.add("href", "#")
				.class("nav-link")
				.text(page.pillText)
			)
		);

		nav[0].children[0].class("active");

		return nav.map((x) => x.get());
	}

	#createPages(pages) {
		return pages.map((page) => {
			return new Control("div")
			.id(page.id)
			.html(new Showdown.Converter().makeHtml(page.contents))
			.get()
		});
	}
}

export const support = new Support();