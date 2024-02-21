export default class Metadata {
	constructor(photo, created) {
		this.photo = photo;
		this.tags = [];
		this.rating = 0;
		this.location = "";
		this.description = "";
		this.created = created;
	}
}