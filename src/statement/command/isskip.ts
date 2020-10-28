import Statement from "../index";

export default class IsSkip extends Statement {
	public *run() {
		throw new Error("ISSKIP is not implemented yet!");

		return null;
	}
}
