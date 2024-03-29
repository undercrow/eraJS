import * as E from "../../error";
import * as U from "../../parser/util";
import Slice from "../../slice";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class AddVoidChara extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run() {
		throw E.notImpl("ADDVOIDCHARA");

		return null;
	}
}
