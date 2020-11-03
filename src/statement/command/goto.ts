import {assertString} from "../../assert";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";

export default class Goto extends Statement {
	public target: Expr;

	public constructor(target: Expr) {
		super();
		this.target = target;
	}

	public *run(vm: VM) {
		let target = this.target.reduce(vm);
		assertString(target, "1st argument of GOTO must be a string");
		target = target.toUpperCase();

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
