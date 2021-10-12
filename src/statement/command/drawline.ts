import * as U from "../../parser/util";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class DrawLine extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run() {
		yield <const>{type: "line"};
		return null;
	}
}
