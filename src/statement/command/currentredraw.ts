import type Statement from "../index";

export default class CurrentRedraw implements Statement {
	public *run() {
		throw new Error("CURRENTREDRAW is not implemented yet!");
		return null;
	}
}
