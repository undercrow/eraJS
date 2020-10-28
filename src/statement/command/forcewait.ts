import Statement from "../index";

export default class ForceWait extends Statement {
	public *run() {
		throw new Error("FORCEWAIT is not implemented yet!");

		return null;
	}
}
