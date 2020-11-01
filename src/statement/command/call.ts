import {assert} from "../../assert";
import type VM from "../../vm";
import Assign from "../assign";
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
		fnLoop: for (const fn of vm.fnMap.get(this.target)!) {
			vm.pushContext(fn);

			for (let i = 0; i < fn.arg.length; ++i) {
				const argExpr = fn.arg[i];
				const value = arg[i];
				if (argExpr instanceof Assign) {
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (value != null) {
						const index = argExpr.dest.reduceIndex(vm);
						vm.setValue(value, argExpr.dest.name, ...index);
					} else {
						yield* argExpr.run(vm);
					}
				} else {
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					assert(value != null, `${i}th argument of ${this.target} is required`);

					const index = argExpr.reduceIndex(vm);
					vm.setValue(value, argExpr.name, ...index);
				}
			}

			const result = yield* fn.thunk.run(vm);
			vm.popContext();

			switch (result?.type) {
				case "begin": return result;
				case "goto": return result;
				case "break": return result;
				case "continue": return result;
				case "return": {
					vm.setValue(result.value, "RESULT", 0);
					break fnLoop;
				}
				case undefined: continue fnLoop;
			}
		}
		vm.setValue(0, "RESULT", 0);
		return null;
	}
}
