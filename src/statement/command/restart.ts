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

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run() {
		return <const>{
			type: "goto",
			label: Fn.START_OF_FN,
		};
	}
}
