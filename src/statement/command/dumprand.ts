import type Statement from "../index";

export default class DumpRand implements Statement {
	public *run() {
		throw new Error("DUMPRAND is not implemented yet!");

		return null;
	}
}
