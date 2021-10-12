import * as U from "../../parser/util";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class StrData extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run() {
		throw new Error("STRDATA is not implemented yet!");

		return null;
	}
}
