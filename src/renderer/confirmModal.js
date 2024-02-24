import Control from "./control";
import { $ } from "./shorthand";

class ConfirmModal {
	#control = {
		title: $("#confirmModalTitle"),
		body: $("#confirmModalBody"),
		negative: $("#confirmModalNegative"),
		positive: $("#confirmModalPositive"),
	};

	#question = null;

	#modal = new bootstrap.Modal($("#confirmModal"));

	constructor() {
		window.listen.showConfirmDialog((title, paragraphs, negative, positive, question) => {
			this.#show(title, paragraphs, negative, positive, question)
		});

		this.#control.negative.addEventListener("click", () => {
			this.#modal.hide();
			this.#doReply("no");
		});

		this.#control.positive.addEventListener("click", () => {
			this.#modal.hide();
			this.#doReply("yes");
		});
	}

	#setText(title, paragraphs, negative, positive) {
		this.#resetBody();

		paragraphs.forEach((text) => {
			this.#control.body.appendChild(new Control("p").text(text).get());
		});
		
		this.#control.title.innerText = title;
		this.#control.negative.innerText = negative;
		this.#control.positive.innerText = positive;
	}

	#show(title, paragraphs, negative, positive, question) {
		this.#setText(title, paragraphs, negative, positive);
		this.#question = question;

		this.#modal.show();
	}

	#resetBody() {
		this.#control.body.innerText = "";
	}

	#doReply(answer) {
		const reply = this.#question + "." + answer;
		window.invoke.replyConfirmDialog(reply);
	}
}

export const confirmModal = new ConfirmModal();