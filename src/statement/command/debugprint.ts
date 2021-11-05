import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import {PrintFlag} from "../../printer";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R0(C.charSeq()).map((str) => str ?? "");
export default class DebugPrint extends Statement {
	public flags: Set<PrintFlag>;
	public value: Lazy<string>;

	public constructor(flags: PrintFlag[], raw: Slice) {
		super(raw);

		this.flags = new Set(flags);
		this.value = new Lazy(raw, PARSER);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(_vm: VM) {
		// TODO

		return null;
	}
}
