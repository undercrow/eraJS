import Statement from "../index";

export default class StopCallTrain extends Statement {
	public *run() {
		throw new Error("STOPCALLTRAIN is not implemented yet!");

		return null;
	}
}
