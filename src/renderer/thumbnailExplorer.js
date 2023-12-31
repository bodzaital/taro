export let cullNavigatorState = null;

export function selectThumbnail(thumbnail) {
	document.querySelector(".thumbnail.active").classList.remove("active");

	thumbnail.classList.add("active");
	loadActivePhoto(thumbnail);
}

export function toggleCullNavigators(toState) {
	const prevCullButton = document.querySelector(".lhs");
	const nextCullButton = document.querySelector(".rhs");

	if (toState == "enabled") {
		prevCullButton.classList.remove("disabled");
	} else {
		prevCullButton.classList.add("disabled");
	}

	if (toState == "enabled") {
		nextCullButton.classList.remove("disabled");
	} else {
		nextCullButton.classList.add("disabled");
	}

	cullNavigatorState = toState;
}

export function loadActivePhoto() {
	const activeThumbnail = document.querySelector(".thumbnail.active");
	if (activeThumbnail == null) return;
	
	const activePhoto = document.querySelector("#activePhoto");
	activePhoto.style.backgroundImage = `url('${activeThumbnail.src}')`;
}