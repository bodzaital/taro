import { $ } from "./shorthand";
import { selectThumbnail, showSelectedThumbnail } from "./thumbnail";

class Navigator {
	constructor(element, direction) {
		this.element = element;
		this.state = "disabled";

		this.element.addEventListener("click", (e) => {
			e.preventDefault();
			navigate(direction);
		});
	}

	/** This should not be called outside. Use updateNavigatorStates() instead. */
	setState(nextState) {
		if (nextState == "enabled") {
			this.element.classList.remove("disabled");
		} else {
			this.element.classList.add("disabled");
		}
	
		this.state = nextState;
	}
}

export const prevNavigator = new Navigator($(".navigator.previous"), "previous");
export const nextNavigator = new Navigator($(".navigator.next"), "next");

window.addEventListener("keydown", (e) => {
	if (e.key == "ArrowLeft" || e.key == "ArrowRight") e.preventDefault();
	if (e.key == "ArrowLeft") navigate("previous");
	if (e.key == "ArrowRight") navigate("next");
});

function navigate(direction) {
	if (direction == "previous") navigatePrev();
	if (direction == "next") navigateNext();
}

function navigatePrev() {
	if (prevNavigator.state == "disabled") return;

	let activeThumbnail = $(".thumbnail.active");
	let prevThumbnail = activeThumbnail.previousSibling;

	selectThumbnail(prevThumbnail);
	showSelectedThumbnail();
	
	updateNavigatorStates();
}

function navigateNext() {
	if (nextNavigator.state == "disabled") return;

	let activeThumbnail = $(".thumbnail.active");
	let nextThumbnail = activeThumbnail.nextSibling;

	selectThumbnail(nextThumbnail);
	showSelectedThumbnail();

	updateNavigatorStates();
}

export function updateNavigatorStates(overridePrev = null, overrideNext = null) {
	if (overridePrev != null) {
		prevNavigator.setState(overridePrev);
	} else {
		let prevForeshadow = $(".thumbnail.active").previousSibling;
		prevNavigator.setState(prevForeshadow == null
			? "disabled"
			: "enabled"	
		);
	}

	if (overrideNext != null) {
		nextNavigator.setState(overrideNext);
	} else {
		let nextForeshadow = $(".thumbnail.active").nextSibling;
		nextNavigator.setState(nextForeshadow == null
			? "disabled"
			: "enabled"	
		);
	}
}

// export function displayPhoto() {
// 	const selectedPhoto = $(".thumbnail.active");
// 	photo.style.backgroundImage = `url('${selectedPhoto.src}')`;
// }

// export function clearPhoto() {
// 	photo.style.backgroundImage = "";
// }