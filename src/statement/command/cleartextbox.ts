import type Statement from "../index";

export default class ClearTextBox implements Statement {
	public *run() {
		throw new Error("CLEARTEXTBOX is not implemented yet!");
		return null;
	}
}
