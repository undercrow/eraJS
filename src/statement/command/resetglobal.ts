import * as U from "../../erb/util";
import Statement from "../index";

export default class ResetGlobal extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run() {
		throw new Error("RESETGLOBAL is not implemented yet!");

		return null;
	}
}
