import * as U from "../../erb/util";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class LineIsEmpty extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run() {
		throw new Error("LINEISEMPTY is not implemented yet!");

		return null;
	}
}
