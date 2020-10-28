import type Statement from "../index";

export default class ResetGlobal implements Statement {
	public *run() {
		throw new Error("RESETGLOBAL is not implemented yet!");

		return null;
	}
}
