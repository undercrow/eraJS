import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";
import Goto from "./goto";

const PARSER = U.arg1R1(U.Identifier);
export default class TryGoto extends Statement {
	public static parse(raw: string): TryGoto {
		const target = PARSER.tryParse(raw);
		return new TryGoto(target);
	}

	public target: string;

	public constructor(target: string) {
		super();
		this.target = target;
	}

	public *run(vm: VM) {
		const target = this.target.toUpperCase();
		const context = vm.context();
		if (context.fn.thunk.labelMap.has(target)) {
			return yield* new Goto(this.target).run(vm);
		}

		return null;
	}
}
