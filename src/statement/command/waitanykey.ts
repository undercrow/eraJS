import type Statement from "../index";

export default class WaitAnyKey implements Statement {
	public *run() {
		throw new Error("WAITANYKEY is not implemented yet!");

		return null;
	}
}
