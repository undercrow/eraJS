import {assert, assertString} from "../../assert";
import type VM from "../../vm";
import Assign from "../assign";
import Expr from "../expr";
import Statement from "../index";

export default class Call extends Statement {
	public target: Expr;
	public arg: Expr[];

	public constructor(target: Expr, arg: Expr[]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		let target = this.target.reduce(vm);
		assertString(target, "1st argument of CALL must be a string");
		target = target.toUpperCase();
		assert(vm.fnMap.has(target), `Function ${target} does not exist`);

		const arg = this.arg.map((a) => a.reduce(vm));
		fnLoop: for (const fn of vm.fnMap.get(target)!) {
			const context = vm.pushContext(fn);

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
					if (!context.refMap.has(argExpr.name)) {
						const type = vm.typeof(argExpr.name);
						const fallback = type === "number" ? 0 : "";
						const index = argExpr.reduceIndex(vm);
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						vm.setValue(value ?? fallback, argExpr.name, ...index);
					}
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
					for (let i = 0; i < result.value.length; ++i) {
						vm.setValue(result.value[i], "RESULT", i);
					}
					break fnLoop;
				}
				case undefined: continue fnLoop;
			}
		}
		vm.setValue(0, "RESULT", 0);
		return null;
	}
}
