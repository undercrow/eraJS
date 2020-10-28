import type Statement from "../index";

export default class InitRand implements Statement {
	public *run() {
		throw new Error("INITRAND is not implemented yet!");

		return null;
	}
}
