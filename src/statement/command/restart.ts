import Statement from "../index";

export default class Restart extends Statement {
	public *run() {
		throw new Error("RESTART is not implemented yet!");
		return null;
	}
}
