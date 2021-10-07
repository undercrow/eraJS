import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class LoadGlobal extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run(_vm: VM) {
		throw new Error("LOADGLOBAL is not implemented yet!");

		return null;
	}
}
