import Control from "./control";
import { $ } from "./shorthand";

class InAppNotifications {
	#container = $("#inAppNotifications");

	constructor() {
		this.#container.addEventListener("hidden.bs.toast", (e) => {
			e.target.remove();
		});
	}

	create(text, category = null) {
		const notification = new Control("div")
			.class("toast", "align-items-center", `text-bg-${category}`)
			.child(new Control("div")
				.class("d-flex")
				.child(new Control("div")
					.class("toast-body")
					.text(text)
					.get())
				.child(new Control("button")
					.class("btn-close", "btn-close-white", "me-2", "m-auto")
					.data("bsDismiss", "toast")
					.get())
				.get())
			.get();

		this.#container.appendChild(notification);

		const toast = new bootstrap.Toast(notification);
		toast.show();
	}
}

export const notifications = new InAppNotifications();