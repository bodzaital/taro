import { $ } from "./shorthand";

class Navigator {
	constructor(element, direction) {
		this.element = element;
		this.state = "disabled";

		this.element.addEventListener("click", (e) => {
			e.preventDefault();
			navigate(direction);
		});
	}

	updateState() {
		
	}
}

const photo = $("#activePhoto");

export const prevNavigator = new Navigator($(".navigator.previous"), "previous");
export const nextNavigator = new Navigator($(".navigator.next"), "next");

function navigate(direction) {
	if (direction == "next") navigateNext();
	if (direction == "previous") navigatePrev();
}

function navigatePrev() {
	if (prevNavigator.state == "disabled") return;

	let activeThumbnail = $(".thumbnail.active");
	let prevThumbnail = activeThumbnail.previousSibling;

	selectPhoto(prevThumbnail);

	let foreshadow = $(".thumbnail.active").previousSibling;
	setNavigatorState(prevNavigator, foreshadow == null
		? "disabled"
		: "enabled"
	);

	setNavigatorState(nextNavigator, "enabled");
}

function navigateNext() {
	if (nextNavigator.state == "disabled") return;

	let activeThumbnail = $(".thumbnail.active");
	let nextThumbnail = activeThumbnail.nextSibling;

	selectPhoto(nextThumbnail);

	let foreshadow = $(".thumbnail.active").nextSibling;
	setNavigatorState(nextNavigator, foreshadow == null
		? "disabled"
		: "enabled"
	);

	setNavigatorState(prevNavigator, "enabled");
}

export function selectPhoto(thumbnail) {
	$(".thumbnail.active").classList.remove("active");
	thumbnail.classList.add("active");

	displayPhoto(thumbnail);
}

export function displayPhoto() {
	const selectedPhoto = $(".thumbnail.active");
	if (selectedPhoto == null) return;
	
	photo.style.backgroundImage = `url('${selectedPhoto.src}')`;
}

export function setNavigatorState(navigator, nextState) {
	if (nextState == "enabled") {
		navigator.element.classList.remove("disabled");
	} else {
		navigator.element.classList.add("disabled");
	}

	navigator.state = nextState;
}

export function clearPhoto() {
	photo.style.backgroundImage = "";
}