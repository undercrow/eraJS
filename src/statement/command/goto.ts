import * as U from "../../parser/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R1(U.Identifier);
export default class Goto extends Statement {
	public arg: Lazy<string>;

	public constructor(raw: string) {
		super();
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const target = this.arg.get();

		const context = vm.context();
		if (!context.fn.thunk.labelMap.has(target)) {
			throw new Error(`Label ${target} does not exist`);
		}

		return <const>{
			type: "goto",
			label: target,
		};
	}
}
