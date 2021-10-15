import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
import Goto from "./goto";

const PARSER = U.arg1R1(U.Identifier);
export default class TryGoto extends Statement {
	public arg: Lazy<string>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const target = this.arg.get().toUpperCase();
		const context = vm.context();
		if (context.fn.thunk.labelMap.has(target)) {
			return yield* Goto.exec(vm, target);
		}

		return null;
	}
}
