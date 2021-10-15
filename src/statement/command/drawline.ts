import * as U from "../../parser/util";
import Slice from "../../slice";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class DrawLine extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	public *run() {
		yield <const>{type: "line"};
		return null;
	}
}
