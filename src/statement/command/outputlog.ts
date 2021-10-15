import * as EM from "../../error";
import * as U from "../../parser/util";
import Slice from "../../slice";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class OutputLog extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	public *run() {
		throw EM.notImpl("OUTPUTLOG");

		return null;
	}
}
