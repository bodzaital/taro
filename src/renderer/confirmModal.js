import { Modal } from "bootstrap";
import Control from "./control";
import { i18n } from "./i18n";
import { $ } from "./utility/shorthand";

class ConfirmModal {
	#control = {
		title: $("#confirmModalTitle"),
		body: $("#confirmModalBody"),
		negative: $("#confirmModalNegative"),
		positive: $("#confirmModalPositive"),
	};

	#question = null;
	#modal = new Modal($("#confirmModal"));

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

	#show(title, paragraphs, negative, positive, question) {
		this.#setText(title, paragraphs, negative, positive);
		this.#question = question;

		this.#modal.show();
	}

	#setText(title, paragraphs, negative, positive) {
		this.#resetBody();

		paragraphs.forEach((text) => {
			this.#control.body.appendChild(new Control("p").text(i18n.pull(text)).get());
		});
		
		this.#control.title.innerText = i18n.pull(title);
		this.#control.negative.innerText = i18n.pull(negative);
		this.#control.positive.innerText = i18n.pull(positive);
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