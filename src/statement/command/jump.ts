import {assert} from "../../assert";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
import Call from "./call";

export default class Jump extends Statement {
	public static parse(raw: string): Jump {
		const [target, arg] = Call.compileArg(raw);
		return new Jump(target, arg);
	}

	public target: string;
	public arg: Expr[];

	public constructor(target: string, arg: Expr[]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		const target = this.target.toUpperCase();
		assert(vm.fnMap.has(target), `Function ${target} does not exist`);

		const arg = this.arg.map((a) => a.reduce(vm));
		for (const fn of vm.fnMap.get(target)!) {
			const result = yield* fn.run(vm, arg);
			if (result != null) {
				return result;
			}
		}

		return null;
	}
}
