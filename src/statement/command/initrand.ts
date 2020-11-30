import * as U from "../../erb/util";
import Statement from "../index";

export default class InitRand extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run() {
		throw new Error("INITRAND is not implemented yet!");

		return null;
	}
}
