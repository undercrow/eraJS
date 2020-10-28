import type Statement from "../index";

export default class ForceWait implements Statement {
	public *run() {
		throw new Error("FORCEWAIT is not implemented yet!");

		return null;
	}
}
