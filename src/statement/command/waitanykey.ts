import * as U from "../../parser/util";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class WaitAnyKey extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run() {
		throw new Error("WAITANYKEY is not implemented yet!");

		return null;
	}
}
