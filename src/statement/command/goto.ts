import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R1(U.Identifier);
export default class Goto extends Statement {
	public static parse(raw: string): Goto {
		const target = PARSER.tryParse(raw);
		return new Goto(target);
	}

	public target: string;

	public constructor(target: string) {
		super();
		this.target = target;
	}

	public *run(vm: VM) {
		const target = this.target.toUpperCase();

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
