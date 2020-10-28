import type Statement from "../index";

export default class StopCallTrain implements Statement {
	public *run() {
		throw new Error("STOPCALLTRAIN is not implemented yet!");

		return null;
	}
}
