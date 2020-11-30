import * as U from "../../erb/util";
import Statement from "../index";

export default class CbgClearButton extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run() {
		throw new Error("CBGCLEARBUTTON is not implemented yet!");

		return null;
	}
}
