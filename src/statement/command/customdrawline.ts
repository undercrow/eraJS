import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R1(C.charSeq());
export default class CustomDrawLine extends Statement {
	public arg: Lazy<string>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const value = this.arg.get();

		yield* vm.queue.line(value);

		return null;
	}
}
