import {assert} from "../../assert";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";

export default class Call extends Statement {
	public target: string;
	public arg: Expr[];

	public constructor(target: string, arg: Expr[]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		const arg = this.arg.map((a) => a.reduce(vm));
		assert(vm.fnMap.has(this.target), `Function ${this.target} does not exist`);
		for (const fn of vm.fnMap.get(this.target)!) {
			vm.pushContext(fn);

			for (let i = 0; i < fn.arg.length; ++i) {
				const dest = fn.arg[i];
				const value = arg[i];
				const index = dest.reduceIndex(vm);
				vm.setValue(value, dest.name, ...index);
			}

			const result = yield* fn.thunk.run(vm);
			vm.popContext();

			if (result != null) {
				return result;
			}
		}
		return null;
	}
}
