import type Statement from "../index";

export default class IsSkip implements Statement {
	public *run() {
		throw new Error("ISSKIP is not implemented yet!");

		return null;
	}
}
