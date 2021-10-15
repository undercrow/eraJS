import * as EM from "../../error";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R1(U.charSeq());
export default class SetColorByName extends Statement {
	public arg: Lazy<string>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(_vm: VM) {
		throw EM.notImpl("SETCOLORBYNAME");

		return null;
	}
}
