import { $ } from "./shorthand";

class InAppNotifications {
	#container = $("#inAppNotifications");

	constructor() {
		this.#container.addEventListener("hidden.bs.toast", (e) => {
			e.target.remove();
		});
	}

	create(text, category = null) {
		const notification = document.createElement("div");
		notification.classList.add("toast");
		notification.classList.add("align-items-center");

		if (category == null) category = "secondary";
		notification.classList.add(`text-bg-${category}`);

		const flexContainer = document.createElement("div");
		flexContainer.classList.add("d-flex")

		const body = document.createElement("div");
		body.classList.add("toast-body");
		body.innerText = text;

		flexContainer.appendChild(body);

		const dismissButton = document.createElement("button");
		dismissButton.classList.add("btn-close");
		dismissButton.classList.add("btn-close-white");
		dismissButton.classList.add("me-2");
		dismissButton.classList.add("m-auto");
		dismissButton.dataset.bsDismiss = "toast";

		flexContainer.appendChild(dismissButton);

		notification.appendChild(flexContainer);

		this.#container.appendChild(notification);
		const toast = new bootstrap.Toast(notification);
		toast.show();
	}
}

export const notifications = new InAppNotifications();