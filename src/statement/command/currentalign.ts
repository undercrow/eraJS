import type Statement from "../index";

export default class CurrentAlign implements Statement {
	public *run() {
		throw new Error("CURRENTALIGN is not implemented yet!");
		return null;
	}
}
