import * as U from "../../parser/util";
import Fn from "../../fn";
import Slice from "../../slice";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class Restart extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	public *run() {
		return <const>{
			type: "goto",
			label: Fn.START_OF_FN,
		};
	}
}
